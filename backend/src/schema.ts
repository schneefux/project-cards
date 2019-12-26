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
    t.model.cards()
    t.model.atTurn()
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
      type: 'Game',
      // TODO check that the return value is indeed a valid 'Game'
      // - unfetched relations might be missing
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
                cards: true,
              },
            },
            piles: {
              include: {
                cards: true,
              },
            },
          },
        })
        if (game == null) {
          throw new Error('Game does not exist')
        }

        const playerHand = game.hands.find(h => h.player.id == user)
        if (playerHand == null) {
          throw new Error('User is not in game')
        }

        if (!playerHand.atTurn) {
          throw new Error('Player is not at turn')
        }

        const opponentHand = game.hands.find(h => h.player.id != user)
        const userHand = game.hands.find(h => h.player.id == user)
        if (opponentHand == null || userHand == null) {
          throw new Error('Hands do not exist - this should not happen')
        }

        const opponent = opponentHand.player.id

        const bids = game.piles.find(p => p.name == user)
        if (bids == null) {
          throw new Error(
            'User bid pile does not exist - this should not happen',
          )
        }

        const bidIndex = bids.cards.findIndex(c => c.id == cardId)
        if (bidIndex == -1) {
          throw new Error('Player does not own card')
        }

        const bid = userHand.cards[bidIndex]
        await ctx.photon.gameHands.update({
          where: { id: userHand.id },
          data: {
            cards: { disconnect: [{ id: bid.id }] },
            atTurn: false,
          },
        })

        await ctx.photon.gamePiles.update({
          where: { id: user },
          data: {
            cards: { connect: [{ id: bid.id }] },
          },
        })

        // refetch new state
        const newGame = await ctx.photon.games.findOne({
          where: { id: gameId },
          include: {
            hands: {
              include: {
                player: true,
                cards: {
                  include: {
                    attributeValues: true,
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

        if (newGame == null) {
          throw new Error('Game is gone - this should not happen')
        }

        if (opponentHand.atTurn) {
          // wait until next turn
          return newGame
        }

        const prices = newGame.piles.find(p => p.name == 'price')
        const userBids = newGame.piles.find(p => p.name == user)
        const opponentBids = newGame.piles.find(p => p.name == opponent)
        if (prices == null || userBids == null || opponentBids == null) {
          throw new Error('Piles do not exist - this should not happen')
        }

        const cardScore = (attributeValues: TrumpAttributeValue[]) =>
          attributeValues[0].value

        const price = prices.cards.reduce(
          (sum, card) => sum + cardScore(card.attributeValues),
          0,
        )
        const opponentBid = opponentBids.cards.reduce(
          (sum, card) => sum + cardScore(card.attributeValues),
          0,
        )
        const userBid = userBids.cards.reduce(
          (sum, card) => sum + cardScore(card.attributeValues),
          0,
        )

        // add price score to winner
        if (userBid > opponentBid) {
          await ctx.photon.gameHands.update({
            where: { id: playerHand.id },
            data: {
              score: playerHand.score + price,
            },
          })
        }
        if (userBid < opponentBid) {
          await ctx.photon.gameHands.update({
            where: { id: opponentHand.id },
            data: {
              score: opponentHand.score + price,
            },
          })
        }

        if (userBid != opponentBid) {
          // clear bid & price piles
          await ctx.photon.gamePiles.update({
            where: { id: userBids.id },
            data: {
              cards: {
                disconnect: userBids.cards.map(c => ({ id: c.id })),
              },
            },
          })
          await ctx.photon.gamePiles.update({
            where: { id: opponentBids.id },
            data: {
              cards: {
                disconnect: opponentBids.cards.map(c => ({ id: c.id })),
              },
            },
          })
          await ctx.photon.gamePiles.update({
            where: { id: prices.id },
            data: {
              cards: {
                disconnect: prices.cards.map(c => ({ id: c.id })),
              },
            },
          })
        }

        // draw new price
        const reserves = newGame.piles.find(p => p.name == 'reserve')
        if (reserves == null) {
          throw new Error('Reserve pile not found - this should not happen')
        }

        // TODO end game if reserve is empty
        const newPrices = reserves.cards.splice(0, 1)
        await ctx.photon.gamePiles.update({
          where: { id: reserves.id },
          data: {
            cards: {
              disconnect: newPrices.map(c => ({ id: c.id })),
            },
          },
        })
        await ctx.photon.gamePiles.update({
          where: { id: prices.id },
          data: {
            cards: {
              connect: newPrices.map(c => ({ id: c.id })),
            },
          },
        })

        return await ctx.photon.games.findOne({ where: { id: gameId } })
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
                { name: player1 },
                { name: player2 },
              ],
            },
            hands: {
              create: [
                {
                  player: { connect: { id: player1 } },
                  score: 0,
                  cards: { connect: hand1Cards.map(c => ({ id: c.id })) },
                  atTurn: true,
                },
                {
                  player: { connect: { id: player2 } },
                  score: 0,
                  cards: { connect: hand2Cards.map(c => ({ id: c.id })) },
                  atTurn: true,
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
