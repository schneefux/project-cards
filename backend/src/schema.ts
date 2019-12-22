import * as path from 'path'
import * as fs from 'fs'
import { nexusPrismaPlugin } from 'nexus-prisma'
import { makeSchema, objectType, stringArg, arg, intArg, idArg } from 'nexus'
import { GraphQLUpload, FileUpload } from 'graphql-upload'
import { Context } from './context'

const IMAGE_DIR = process.env.IMAGE_DIR || './images'

const Upload = GraphQLUpload

const User = objectType({
  name: 'User',
  definition(t: any) {
    t.model.id()
    t.model.name()
    t.model.email()
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

    t.field('startTrumpGame', {
      type: 'TrumpGame',
      nullable: false,
      args: {
        player1: stringArg({ nullable: false }),
        player2: stringArg({ nullable: false }),
        pack: stringArg({ nullable: false }),
      },
      resolve: async (
        parent: any,
        {
          player1,
          player2,
          pack,
        }: { player1: string; player2: string; pack: string },
        ctx: Context,
      ) => {
        const trumpGame = await ctx.photon.trumpGames.create({
          data: {
            players: {
              connect: [
                {
                  id: player1,
                },
                {
                  id: player2,
                },
              ],
            },
            pack: {
              connect: {
                id: pack,
              },
            },
            playerAtTurn: {
              connect: {
                id: player1,
              },
            },
          },
        })
        ctx.pubsub.publish('CREATED_TRUMP_GAME', {
          createdTrumpGame: trumpGame,
        })
        return trumpGame
      },
    })
  },
})

const Subscription = objectType({
  name: 'Subscription',
  definition(t: any) {
    t.field('createdTrumpGame', {
      type: 'TrumpGame',
      nullable: false,
      subscribe: (parent: any, {}, ctx: Context) =>
        ctx.pubsub.asyncIterator('CREATED_TRUMP_GAME'),
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
    TrumpGame,
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
