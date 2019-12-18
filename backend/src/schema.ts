import * as path from 'path'
import { nexusPrismaPlugin } from 'nexus-prisma'
import { makeSchema, objectType, stringArg } from 'nexus'
import { Context } from './context'

const User = objectType({
  name: 'User',
  definition(t: any) {
    t.model.id()
    t.model.name()
    t.model.email()
    t.model.trumpPlayer()
  },
})

const TrumpPlayer = objectType({
  name: 'TrumpPlayer',
  definition(t: any) {
    t.model.id()
    t.model.user()
    t.model.trumpPacks()
    t.model.trumpGames()
    t.model.trumpGamesAtTurn()
  },
})

const TrumpGame = objectType({
  name: 'TrumpGame',
  definition(t: any) {
    t.model.id()
    t.model.players()
    t.model.pack()
    t.model.playerAtTurn()
  },
})

const TrumpPack = objectType({
  name: 'TrumpPack',
  definition(t: any) {
    t.model.id()
    t.model.name()
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
    t.model.description()
    t.model.attributeValues()
    t.model.imageUrl()
  },
})

const TrumpAttribute = objectType({
  name: 'TrumpAttribute',
  definition(t: any) {
    t.model.id()
    t.model.name()
    t.model.aimHigh()
  },
})


const TrumpAttributeValue = objectType({
  name: 'TrumpAttributeValue',
  definition(t: any) {
    t.model.id()
    t.model.attribute()
    t.model.value()
  },
})

const Query = objectType({
  name: 'Query',
  definition(t: any) {
    t.crud.user()
    t.crud.trumpPlayers()
    t.crud.trumpPacks()
    t.crud.trumpGames()
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t: any) {
    t.crud.createOneUser()
    t.crud.createOneTrumpPack()
    t.crud.createOneTrumpCard()
    t.crud.createOneTrumpAttribute()

    t.field('startTrumpGame', {
      type: 'TrumpGame',
      nullable: false,
      args: {
        player1: stringArg({ nullable: false }),
        player2: stringArg({ nullable: false }),
        pack: stringArg({ nullable: false }),
      },
      resolve: async (parent: any,
          { player1, player2, pack }: { player1: string, player2: string, pack: string },
          ctx: Context) => {
        const trumpGame = await ctx.photon.trumpGames.create({
          data: {
            players: {
              connect: [{
                id: player1,
              }, {
                id: player2,
              }]
            },
            pack: {
              connect: {
                id: pack,
              }
            },
            playerAtTurn: {
              connect: {
                id: player1,
              }
            },
          },
        })
        ctx.pubsub.publish('CREATED_TRUMP_GAME', {
          createdTrumpGame: trumpGame
        })
        return trumpGame
      }
    })
  },
})

const Subscription = objectType({
  name: 'Subscription',
  definition(t: any) {
    t.field('createdTrumpGame', {
      type: 'TrumpGame',
      nullable: false,
      subscribe: (parent: any, { }, ctx: Context) =>
        ctx.pubsub.asyncIterator('CREATED_TRUMP_GAME')
    })
  }
})

export const schema = makeSchema({
  types: [Query, Mutation, Subscription, User, TrumpPlayer, TrumpGame, TrumpPack,
    TrumpCard, TrumpAttribute, TrumpAttributeValue],
  plugins: [nexusPrismaPlugin({
    outputs: {
      typegen: path.join(__dirname, '../nexus-prisma.generated.d.ts'),
    }
  })],
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
