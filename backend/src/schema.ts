import { nexusPrismaPlugin } from 'nexus-prisma'
import { idArg, makeSchema, objectType, stringArg } from 'nexus'

const User = objectType({
  name: 'User',
  definition(t) {
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
  definition(t) {
    t.model.id()
    t.model.users()
    t.model.pack()
    t.model.userAtTurn()
  },
})

const TrumpPack = objectType({
  name: 'TrumpPack',
  definition(t) {
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
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.description()
    t.model.attributeValues()
    t.model.imageUrl()
  },
})

const TrumpAttribute = objectType({
  name: 'TrumpAttribute',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.aimHigh()
  },
})


const TrumpAttributeValue = objectType({
  name: 'TrumpAttributeValue',
  definition(t) {
    t.model.id()
    t.model.attribute()
    t.model.value()
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.crud.createOneUser({ alias: 'signupUser' })
  },
})

export const schema = makeSchema({
  types: [Query, Mutation, User, TrumpGame, TrumpPack,
    TrumpCard, TrumpAttribute, TrumpAttributeValue],
  plugins: [nexusPrismaPlugin()],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
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
