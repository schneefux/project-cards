import * as path from 'path'
import * as fs from 'fs'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { nexusPrismaPlugin } from 'nexus-prisma'
import { makeSchema, objectType, stringArg, arg, idArg } from 'nexus'
import { GraphQLUpload, FileUpload } from 'graphql-upload'
import { Context } from './context'
import { getUserId, shuffle } from './util'
import { TrumpCard, TrumpAttributeValue } from '@prisma/photon'

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
  },
})

const GamePile = objectType({
  name: 'GamePile',
  definition(t: any) {
    t.model.id()
    t.model.game()
    t.model.cards()
    t.model.name()
  },
})

const GameHand = objectType({
  name: 'GameHand',
  definition(t: any) {
    t.model.id()
    t.model.game()
    t.model.player()
    t.model.score()
    t.model.atTurn()
  },
})

const GameHandPile = objectType({
  name: 'GameHandPile',
  definition(t: any) {
    t.model.id()
    t.model.hand()
    t.model.cards()
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

const Query = objectType({
  name: 'Query',
  definition(t: any) {
    t.crud.user()
    t.crud.trumpPack()
    t.crud.trumpPacks()
    t.crud.games()

    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: async (parent: any, {}, ctx: Context) => {
        const id = await getUserId(ctx)
        if (id == null) {
          return null
        }
        return await ctx.photon.users.findOne({ where: { id } })
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t: any) {
    t.crud.createOneTrumpPack()
    t.crud.createOneTrumpCard()
    t.crud.createOneTrumpAttribute()

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
        if (existingUser !== null) {
          return null
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await ctx.photon.users.create({
          data: {
            email,
            name,
            password: hashedPassword,
          },
        })

        const token = jwt.sign(
          {
            id: user.id,
          },
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

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
          return null
        }

        const token = jwt.sign(
          {
            id: user.id,
          },
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
        // TODO validate file (size, type)
        // TODO use a directory structure
        // TODO validate ownership
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
        cardId: idArg({ required: true }),
      },
      resolve: async (
        parent: any,
        { gameId, cardId }: { gameId: string; cardId: string },
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
        const user = await getUserId(ctx)
        if (user == null) {
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
                    cards: {
                      include: {
                        attributeValues: true,
                      },
                    },
                  },
                },
              },
            },
            piles: {
              include: {
                cards: {
                  include: {
                    attributeValues: true,
                  },
                },
              },
            },
          },
        })
        if (game == null) {
          throw new Error('Game does not exist')
        }

        const userHand = game.hands.find(h => h.player.id == user)
        if (userHand == null) {
          throw new Error('User is not in game')
        }

        if (!userHand.atTurn) {
          throw new Error('User is not at turn')
        }

        const opponentHand = game.hands.find(h => h.player.id != user)
        if (opponentHand == null) {
          throw new Error('Opponent does not exist - this should not happen')
        }

        const userBidPile = userHand.piles.find(p => p.name == 'bid')
        const userHandPile = userHand.piles.find(p => p.name == 'hand')
        if (userBidPile == null || userHandPile == null) {
          throw new Error('User piles do not exist - this should not happen')
        }

        const bidIndex = userBidPile.cards.findIndex(c => c.id == cardId)
        if (bidIndex == -1) {
          throw new Error('Player does not own card')
        }

        const userBid = userBidPile.cards[bidIndex]
        // user at turn = false
        userHand.atTurn = false
        await ctx.photon.gameHands.update({
          where: { id: userHand.id },
          data: {
            atTurn: false,
          },
        })
        // move card from hand pile to bid pile
        userHandPile.cards.splice(bidIndex, 1)
        await ctx.photon.gameHandPiles.update({
          where: { id: userHandPile.id },
          data: {
            cards: { disconnect: [{ id: userBid.id }] },
          },
        })
        userBidPile.cards.push(userBid)
        await ctx.photon.gameHandPiles.update({
          where: { id: userBidPile.id },
          data: {
            cards: { connect: [{ id: userBid.id }] },
          },
        })

        if (opponentHand.atTurn) {
          // wait for opponent
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

        const price = pricePile.cards.reduce(
          (sum, card) => sum + cardScore(card.attributeValues),
          0,
        )
        const opponentScore = opponentBidPile.cards.reduce(
          (sum, card) => sum + cardScore(card.attributeValues),
          0,
        )
        const userScore = userBidPile.cards.reduce(
          (sum, card) => sum + cardScore(card.attributeValues),
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

        if (userScore != opponentScore) {
          // clear bid & price piles
          await ctx.photon.gameHandPiles.update({
            where: { id: userBidPile.id },
            data: {
              cards: {
                disconnect: userBidPile.cards.map(c => ({ id: c.id })),
              },
            },
          })
          await ctx.photon.gameHandPiles.update({
            where: { id: opponentBidPile.id },
            data: {
              cards: {
                disconnect: opponentBidPile.cards.map(c => ({ id: c.id })),
              },
            },
          })
          await ctx.photon.gamePiles.update({
            where: { id: pricePile.id },
            data: {
              cards: {
                disconnect: pricePile.cards.map(c => ({ id: c.id })),
              },
            },
          })
        }

        // draw new price
        const reservePile = game.piles.find(p => p.name == 'reserve')
        if (reservePile == null) {
          throw new Error('Reserve pile not found - this should not happen')
        }

        // TODO end game if reserve is empty
        const newPrices = reservePile.cards.splice(0, 1)
        await ctx.photon.gamePiles.update({
          where: { id: reservePile.id },
          data: {
            cards: {
              disconnect: newPrices.map(c => ({ id: c.id })),
            },
          },
        })
        await ctx.photon.gamePiles.update({
          where: { id: reservePile.id },
          data: {
            cards: {
              connect: newPrices.map(c => ({ id: c.id })),
            },
          },
        })

        return true
      },
    })

    t.field('startGoofenspiel', {
      type: 'Game',
      nullable: false,
      args: {
        opponent: stringArg({ required: true }),
        pack: stringArg({ required: true }),
      },
      resolve: async (
        parent: any,
        { opponent, pack }: { opponent: string; pack: string },
        ctx: Context,
      ) => {
        const user = await getUserId(ctx)
        if (user == null) {
          return new Error('Not authenticated')
        }

        const trumpCards = await ctx.photon.trumpCards.findMany({
          where: { pack: { id: pack } },
        })
        if (trumpCards.length < 10) {
          throw new Error('Not enough cards in pack')
        }

        const player1 = opponent
        const player2 = user

        const cards = shuffle(
          trumpCards.concat(trumpCards, trumpCards, trumpCards),
        )
        const third = Math.floor(cards.length / 3)
        const hand1Cards = cards.splice(0, third)
        const hand2Cards = cards.splice(0, third)
        const priceCards = cards.splice(0, 1)
        const reserveCards = cards

        const game = await ctx.photon.games.create({
          data: {
            piles: {
              create: [
                {
                  name: 'reserve',
                  cards: { connect: reserveCards.map(c => ({ id: c.id })) },
                },
                {
                  name: 'price',
                  cards: { connect: priceCards.map(c => ({ id: c.id })) },
                },
              ],
            },
            hands: {
              create: [
                {
                  player: { connect: { id: player1 } },
                  score: 0,
                  atTurn: true,
                  piles: {
                    create: [
                      {
                        name: 'hand',
                        cards: { connect: hand1Cards.map(c => ({ id: c.id })) },
                      },
                      {
                        name: 'bid',
                      },
                    ],
                  },
                },
                {
                  player: { connect: { id: player2 } },
                  score: 0,
                  atTurn: true,
                  piles: {
                    create: [
                      {
                        name: 'hand',
                        cards: { connect: hand2Cards.map(c => ({ id: c.id })) },
                      },
                      {
                        name: 'bid',
                      },
                    ],
                  },
                },
              ],
            },
            pack: { connect: { id: pack } },
          },
        })

        ctx.pubsub.publish('STARTED_GAME', {
          createdGame: game,
        })

        return game
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
    GamePile,
    GameHand,
    GameHandPile,
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
