import * as path from 'path'
import * as fs from 'fs'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { nexusPrismaPlugin } from 'nexus-prisma'
import {
  makeSchema,
  objectType,
  stringArg,
  arg,
  idArg,
  enumType,
  queryType,
  mutationType,
  intArg,
} from 'nexus'
import { GraphQLUpload, FileUpload } from 'graphql-upload'
import { Context } from './context'
import { shuffle, JwtCredentials, getCredentials } from './util'
import {
  TrumpCard,
  TrumpAttributeValue,
  UserCreateInput,
  User,
} from '@prisma/photon'
import { withFilter } from 'graphql-yoga'

const IMAGE_DIR = process.env.IMAGE_DIR || './images'
const JWT_SECRET = process.env.JWT_SECRET || ''

const Upload = GraphQLUpload

const LoginResponse = objectType({
  name: 'LoginResponse',
  definition(t: any) {
    t.string('token')
    t.field('user', {
      type: 'User',
    })
  },
})

const User = objectType({
  name: 'User',
  definition(t: any) {
    t.model.id()
    t.model.subscriptionTier()
    t.model.name()
    t.model.email()
    t.model.trumpPacks()
    t.model.gameHands()
  },
})

const Game = objectType({
  name: 'Game',
  definition(t: any) {
    t.model.id()
    t.model.pack()
    t.model.piles()
    t.model.hands()
    t.model.state()
  },
})

const GameState = enumType({
  name: 'GameState',
  members: ['OPEN', 'RUNNING', 'FINISHED'],
})

const GamePile = objectType({
  name: 'GamePile',
  definition(t: any) {
    t.model.id()
    t.model.game()
    t.model.pileCards()
    t.model.name()
  },
})

const GamePileCard = objectType({
  name: 'GamePileCard',
  definition(t: any) {
    t.model.id()
    t.model.index()
    t.model.card()
  },
})

const GameHand = objectType({
  name: 'GameHand',
  definition(t: any) {
    t.model.id()
    t.model.game()
    t.model.player()
    t.model.score()
    t.model.piles()
    t.model.atTurn()
  },
})

const GameHandPile = objectType({
  name: 'GameHandPile',
  definition(t: any) {
    t.model.id()
    t.model.hand()
    t.model.pileCards()
    t.model.name()
  },
})

const TrumpPack = objectType({
  name: 'TrumpPack',
  definition(t: any) {
    t.model.id()
    t.model.name()
    t.model.author()
    t.model.description()
    t.model.cards()
    t.model.attributes()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

const TrumpCard = objectType({
  name: 'TrumpCard',
  definition(t: any) {
    t.model.id()
    t.model.name()
    t.model.pack()
    t.model.description()
    t.model.attributeValues()
    t.model.imageUrl()
  },
})

const TrumpAttribute = objectType({
  name: 'TrumpAttribute',
  definition(t: any) {
    t.model.id()
    t.model.pack()
    t.model.name()
    t.model.aimHigh()
  },
})

const TrumpAttributeValue = objectType({
  name: 'TrumpAttributeValue',
  definition(t: any) {
    t.model.id()
    t.model.card()
    t.model.attribute()
    t.model.value()
  },
})

const Query = queryType({
  definition(t: any) {
    t.crud.user()
    t.crud.users() // TODO restrict access
    t.crud.trumpPack()
    t.crud.game()

    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: async (parent: any, {}, ctx: Context) => {
        const credentials = await getCredentials(ctx)
        if (credentials.id == null) {
          return null
        }
        return await ctx.photon.users.findOne({
          where: { id: credentials.id },
        })
      },
    })

    t.list.field('openGames', {
      type: 'Game',
      nullable: false,
      resolve: async (parent: any, {}, ctx: Context) => {
        return await ctx.photon.games.findMany({
          where: {
            state: 'OPEN',
          },
        })
      },
    })

    t.list.field('featuredTrumpPacks', {
      type: 'TrumpPack',
      nullable: false,
      args: {
        last: intArg({ default: 3 }),
      },
      resolve: async (
        parent: any,
        { last }: { last: number },
        ctx: Context,
      ) => {
        // TODO add a 'featured' flag or a rating metric
        return await ctx.photon.trumpPacks.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          last,
        })
      },
    })
  },
})

const Mutation = mutationType({
  definition(t: any) {
    t.crud.createOneTrumpPack()
    t.crud.createOneTrumpCard()
    t.crud.createOneTrumpAttribute()

    t.field('registerGuest', {
      type: 'LoginResponse',
      nullable: false,
      args: {
        name: stringArg({ required: true }),
      },
      resolve: async (
        parent: any,
        { name }: { name: string },
        ctx: Context,
      ) => {
        const user = await ctx.photon.users.create({
          data: {
            name: name + ' (Guest)',
            subscriptionTier: 'GUEST',
          },
        })

        const token = jwt.sign(
          {
            id: user.id,
            subscriptionTier: 'GUEST',
          } as JwtCredentials,
          JWT_SECRET,
        )

        return {
          token,
          user,
        }
      },
    })

    t.field('register', {
      type: 'LoginResponse',
      nullable: true,
      args: {
        name: stringArg({ required: true }),
        email: stringArg({ required: true }),
        password: stringArg({ required: true }),
      },
      resolve: async (
        parent: any,
        {
          name,
          email,
          password,
        }: { name: string; email: string; password: string },
        ctx: Context,
      ) => {
        const existingUser = await ctx.photon.users.findOne({
          where: { email },
        })
        if (existingUser != null) {
          return null
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const data = {
          email,
          name,
          subscriptionTier: 'FREE',
          password: hashedPassword,
        } as UserCreateInput

        const guestUserCredentials = await getCredentials(ctx)

        let user: User

        // upgrade guest account if available
        if (guestUserCredentials.id != null) {
          user = await ctx.photon.users.update({
            where: { id: guestUserCredentials.id },
            data,
          })
        } else {
          user = await ctx.photon.users.create({
            data,
          })
        }

        const token = jwt.sign(
          {
            id: user.id,
            subscriptionTier: 'FREE',
          } as JwtCredentials,
          JWT_SECRET,
        )

        return {
          token,
          user,
        }
      },
    })

    t.field('login', {
      type: 'LoginResponse',
      nullable: true,
      args: {
        email: stringArg({ required: true }),
        password: stringArg({ required: true }),
      },
      resolve: async (
        parent: any,
        { email, password }: { email: string; password: string },
        ctx: Context,
      ) => {
        const user = await ctx.photon.users.findOne({
          where: {
            email,
          },
        })

        if (!user) {
          return null
        }

        if (user.password == null) {
          throw new Error('Account is locked')
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
          return null
        }

        const token = jwt.sign(
          {
            id: user.id,
            subscriptionTier: user.subscriptionTier,
          } as JwtCredentials,
          JWT_SECRET,
        )

        return {
          token,
          user,
        }
      },
    })

    t.field('uploadTrumpCardImage', {
      type: 'Boolean',
      nullable: false,
      args: {
        file: arg({ type: 'Upload' }),
        cardId: idArg({ nullable: false }),
      },
      resolve: async (
        parent: any,
        { file, cardId }: { file: FileUpload; cardId: string },
        context: Context,
      ) => {
        const userCredentials = await getCredentials(context)
        if (userCredentials.id == null) {
          throw new Error('Not authenticated')
        }

        const card = await context.photon.trumpCards.findOne({
          where: { id: cardId },
          include: {
            pack: {
              include: { author: true },
            },
          },
        })

        if (card == null) {
          throw new Error('Card does not exist')
        }

        if (userCredentials.id != card.pack.author.id) {
          throw new Error('User does not own pack')
        }

        // TODO validate file (size, type)
        // TODO use a directory structure
        // TODO validate destination path
        const { filename, createReadStream } = await file
        const readStream = createReadStream()
        const writeStream = fs.createWriteStream(path.join(IMAGE_DIR, filename))
        readStream.pipe(writeStream)
        await new Promise<boolean>((resolve, reject) => {
          writeStream.on('finish', resolve)
          readStream.on('error', reject)
          writeStream.on('error', reject)
        })

        await context.photon.trumpCards.update({
          where: { id: cardId },
          data: {
            // TODO use absolute URL
            // TODO change filename?
            imageUrl: `/${filename}`,
          },
        })

        return true
      },
    })

    t.field('bidGoofenspiel', {
      type: 'Boolean',
      nullable: false,
      args: {
        gameId: idArg({ required: true }),
        pileCardId: idArg({ required: true }),
      },
      resolve: async (
        parent: any,
        { gameId, pileCardId }: { gameId: string; pileCardId: string },
        ctx: Context,
      ) => {
        /**
         * All cards are divided into 3 piles.
         * One pile is reserved for prices, the other two are the players' hands.
         * Each round, a card from the reserve is revealed.
         * Both players place a secret bid on the card.
         * Highest bid wins the price. On draw, next round begins.
         *
         * Reserve pile: name='reserve'
         * Price pile: name='price'
         * Player bids: name=player id
         */
        const userCredentials = await getCredentials(ctx)
        if (userCredentials.id == null) {
          return new Error('Not authenticated')
        }

        const game = await ctx.photon.games.findOne({
          where: { id: gameId },
          include: {
            hands: {
              include: {
                player: true,
                piles: {
                  include: {
                    pileCards: {
                      include: {
                        card: {
                          include: { attributeValues: true },
                        },
                      },
                    },
                  },
                },
              },
            },
            piles: {
              include: {
                pileCards: {
                  include: {
                    card: {
                      include: {
                        attributeValues: true,
                      },
                    },
                  },
                },
              },
            },
          },
        })
        if (game == null) {
          throw new Error('Game does not exist')
        }

        const userHand = game.hands.find(h => h.player.id == userCredentials.id)
        if (userHand == null) {
          throw new Error('User is not in game')
        }

        if (game.state == 'OPEN') {
          throw new Error('Game has not started yet')
        }

        if (game.state == 'FINISHED') {
          throw new Error('Game has closed')
        }

        if (!userHand.atTurn) {
          throw new Error('User is not at turn')
        }

        const opponentHand = game.hands.find(
          h => h.player.id != userCredentials.id,
        )
        if (opponentHand == null) {
          throw new Error('Opponent does not exist - this should not happen')
        }

        const userBidPile = userHand.piles.find(p => p.name == 'bid')
        const userHandPile = userHand.piles.find(p => p.name == 'hand')
        if (userBidPile == null || userHandPile == null) {
          throw new Error('User piles do not exist - this should not happen')
        }

        const handIndex = userHandPile.pileCards.findIndex(
          p => p.id == pileCardId,
        )
        if (handIndex == -1) {
          throw new Error('Player does not own card')
        }

        game.state = 'RUNNING'
        await ctx.photon.games.update({
          where: { id: game.id },
          data: {
            state: 'RUNNING',
          },
        })

        const userBid = userHandPile.pileCards[handIndex]
        // user at turn = false
        userHand.atTurn = false
        await ctx.photon.gameHands.update({
          where: { id: userHand.id },
          data: {
            atTurn: false,
          },
        })
        // move card from hand pile to bid pile
        userHandPile.pileCards.splice(handIndex, 1)
        await ctx.photon.gameHandPiles.update({
          where: { id: userHandPile.id },
          data: {
            pileCards: { disconnect: [{ id: userBid.id }] },
          },
        })
        userBidPile.pileCards.push(userBid)
        await ctx.photon.gameHandPiles.update({
          where: { id: userBidPile.id },
          data: {
            pileCards: { connect: [{ id: userBid.id }] },
          },
        })

        if (opponentHand.atTurn) {
          // wait for opponent
          ctx.pubsub.publish('UPDATED_GAME', {
            updatedGame: { id: game.id },
          })

          return true
        }

        const pricePile = game.piles.find(p => p.name == 'price')
        if (pricePile == null) {
          throw new Error('Price pile does not exist - this should not happen')
        }

        const opponentBidPile = opponentHand.piles.find(p => p.name == 'bid')
        const opponentHandPile = opponentHand.piles.find(p => p.name == 'hand')

        if (opponentBidPile == null || opponentHandPile == null) {
          throw new Error(
            'Opponent piles do not exist - this should not happen',
          )
        }

        const cardScore = (attributeValues: TrumpAttributeValue[]) =>
          attributeValues[0].value

        const price = pricePile.pileCards.reduce(
          (sum, pileCard) => sum + cardScore(pileCard.card.attributeValues),
          0,
        )
        const opponentScore = opponentBidPile.pileCards.reduce(
          (sum, pileCard) => sum + cardScore(pileCard.card.attributeValues),
          0,
        )
        const userScore = userBidPile.pileCards.reduce(
          (sum, pileCard) => sum + cardScore(pileCard.card.attributeValues),
          0,
        )

        // add price score to winner
        if (userScore > opponentScore) {
          await ctx.photon.gameHands.update({
            where: { id: userHand.id },
            data: {
              score: userHand.score + price,
            },
          })
        }
        if (userScore < opponentScore) {
          await ctx.photon.gameHands.update({
            where: { id: opponentHand.id },
            data: {
              score: opponentHand.score + price,
            },
          })
        }

        const reservePile = game.piles.find(p => p.name == 'reserve')
        if (reservePile == null) {
          throw new Error('Reserve pile not found - this should not happen')
        }

        if (userScore != opponentScore || reservePile.pileCards.length == 0) {
          // clear bid & price piles
          await ctx.photon.gameHandPiles.update({
            where: { id: userBidPile.id },
            data: {
              pileCards: {
                disconnect: userBidPile.pileCards.map(p => ({ id: p.id })),
              },
            },
          })
          await ctx.photon.gameHandPiles.update({
            where: { id: opponentBidPile.id },
            data: {
              pileCards: {
                disconnect: opponentBidPile.pileCards.map(p => ({ id: p.id })),
              },
            },
          })
          await ctx.photon.gamePiles.update({
            where: { id: pricePile.id },
            data: {
              pileCards: {
                disconnect: pricePile.pileCards.map(p => ({ id: p.id })),
              },
            },
          })
        }

        if (reservePile.pileCards.length == 0) {
          // end of game
          ctx.pubsub.publish('UPDATED_GAME', {
            updatedGame: { id: game.id },
          })
          return true
        }

        // draw new price
        const newPrices = reservePile.pileCards.splice(0, 1)
        await ctx.photon.gamePiles.update({
          where: { id: reservePile.id },
          data: {
            pileCards: {
              disconnect: newPrices.map(p => ({ id: p.id })),
            },
          },
        })
        await ctx.photon.gamePiles.update({
          where: { id: pricePile.id },
          data: {
            pileCards: {
              connect: newPrices.map(p => ({ id: p.id })),
            },
          },
        })

        // unlock hands
        await ctx.photon.gameHands.update({
          where: { id: userHand.id },
          data: {
            atTurn: true,
          },
        })
        await ctx.photon.gameHands.update({
          where: { id: opponentHand.id },
          data: {
            atTurn: true,
          },
        })

        ctx.pubsub.publish('UPDATED_GAME', {
          updatedGame: { id: game.id },
        })
        return true
      },
    })

    t.field('joinGoofenspiel', {
      type: 'Boolean',
      nullable: false,
      args: {
        gameId: idArg({ required: true }),
      },
      resolve: async (
        parent: any,
        { gameId }: { gameId: string },
        ctx: Context,
      ) => {
        const userCredentials = await getCredentials(ctx)
        if (userCredentials.id == null) {
          throw new Error('Not authenticated')
        }

        if (
          (await ctx.photon.users.findOne({
            where: { id: userCredentials.id },
          })) == null
        ) {
          throw new Error('User does not exist')
        }

        const game = await ctx.photon.games.findOne({
          where: { id: gameId },
          include: {
            hands: {
              include: {
                player: true,
              },
            },
            pack: {
              include: {
                cards: true,
              },
            },
          },
        })

        if (game == null) {
          throw new Error('Game does not exist')
        }

        if (game.state == 'RUNNING') {
          throw new Error('Game has already started')
        }

        if (game.state == 'FINISHED') {
          throw new Error('Game has already finished')
        }

        const opponentHand = game.hands[0]

        const cards = shuffle(
          game.pack.cards.concat(
            game.pack.cards,
            game.pack.cards,
            game.pack.cards,
          ),
        )
        const third = Math.floor(cards.length / 3)
        const hand1Cards = cards.splice(0, third)
        const hand2Cards = cards.splice(0, third)
        const priceCards = cards.splice(0, 1)
        const reserveCards = cards

        await ctx.photon.gameHands.update({
          where: { id: opponentHand.id },
          data: {
            score: 0,
            atTurn: true,
            piles: {
              create: [
                {
                  name: 'hand',
                  pileCards: {
                    create: hand1Cards.map(c => ({
                      card: { connect: { id: c.id } },
                    })),
                  },
                },
                {
                  name: 'bid',
                },
              ],
            },
          },
        })

        const isFull = game.hands.length + 1 == 2

        await ctx.photon.games.update({
          where: { id: game.id },
          data: {
            state: isFull ? 'RUNNING' : 'OPEN',
            piles: {
              create: [
                {
                  name: 'reserve',
                  pileCards: {
                    create: reserveCards.map(c => ({
                      card: { connect: { id: c.id } },
                    })),
                  },
                },
                {
                  name: 'price',
                  pileCards: {
                    create: priceCards.map(c => ({
                      card: { connect: { id: c.id } },
                    })),
                  },
                },
              ],
            },
            hands: {
              create: [
                {
                  player: { connect: { id: userCredentials.id } },
                  score: 0,
                  atTurn: true,
                  piles: {
                    create: [
                      {
                        name: 'hand',
                        pileCards: {
                          create: hand2Cards.map(c => ({
                            card: { connect: { id: c.id } },
                          })),
                        },
                      },
                      {
                        name: 'bid',
                      },
                    ],
                  },
                },
              ],
            },
          },
        })

        ctx.pubsub.publish('UPDATED_GAME', {
          updatedGame: game,
        })

        return true
      },
    })

    t.field('createGoofenspiel', {
      type: 'ID',
      nullable: false,
      args: {
        pack: idArg({ required: true }),
      },
      resolve: async (
        parent: any,
        { pack }: { pack: string },
        ctx: Context,
      ) => {
        const userCredentials = await getCredentials(ctx)
        if (userCredentials.id == null) {
          throw new Error('Not authenticated')
        }

        if (userCredentials.subscriptionTier == 'GUEST') {
          throw new Error('Not allowed for Guests')
        }

        /*
        const trumpCards = await ctx.photon.trumpCards.findMany({
          where: { pack: { id: pack } },
        })
        if (trumpCards.length < 10) {
          throw new Error('Not enough cards in pack')
        }
        */

        if (
          (await ctx.photon.users.findOne({
            where: { id: userCredentials.id },
          })) == null
        ) {
          throw new Error('User does not exist')
        }

        const game = await ctx.photon.games.create({
          data: {
            state: 'OPEN',
            hands: {
              create: [
                {
                  player: { connect: { id: userCredentials.id } },
                  score: 0,
                  atTurn: false,
                },
              ],
            },
            pack: { connect: { id: pack } },
          },
        })

        ctx.pubsub.publish('STARTED_GAME', {
          createdGame: game,
        })

        return game.id
      },
    })
  },
})

const Subscription = objectType({
  name: 'Subscription',
  definition(t: any) {
    t.field('createdGame', {
      type: 'Game',
      nullable: false,
      subscribe: (parent: any, {}, ctx: Context) =>
        ctx.pubsub.asyncIterator('STARTED_GAME'),
    })

    t.field('updatedGame', {
      type: 'Game',
      nullable: false,
      args: {
        id: idArg({ required: true }),
      },
      subscribe: withFilter(
        (parent: any, { id }: { id: string }, ctx: Context) =>
          ctx.pubsub.asyncIterator('UPDATED_GAME'),
        (payload, { id }: { id: string }) => payload.updatedGame.id == id,
      ),
    })
  },
})

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Subscription,
    Upload,
    User,
    LoginResponse,
    Game,
    GameState,
    GamePile,
    GameHand,
    GameHandPile,
    GamePileCard,
    TrumpPack,
    TrumpCard,
    TrumpAttribute,
    TrumpAttributeValue,
  ],
  plugins: [
    nexusPrismaPlugin({
      outputs: {
        typegen: path.join(__dirname, '../nexus-prisma.generated.d.ts'),
      },
    }),
  ],
  outputs: {
    schema: path.join(__dirname, '../schema.graphql'),
    typegen: path.join(__dirname, '../nexus.generated.d.ts'),
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/photon',
        alias: 'photon',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
  },
})
