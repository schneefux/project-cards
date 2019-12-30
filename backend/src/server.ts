import * as express from 'express'
import { GraphQLServer } from 'graphql-yoga'
import { shield, rule } from 'graphql-shield'
import { schema } from './schema'
import { createContext, Context } from './context'
import { getCredentials, JWT_SECRET } from './util'

const IMAGE_DIR = process.env.IMAGE_DIR || './images'

if (JWT_SECRET == '') {
  throw new Error('JWT_SECRET needs to be set')
}

function shutdown() {
  // Any sync or async graceful shutdown procedures can be run before exiting…
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('SIGHUP', shutdown)

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent: any, args: any, context: Context) => {
    return (await getCredentials(context)).subscriptionTier == null
  },
)

const isTrumpCardOwner = rule({ cache: 'contextual' })(
  async (parent: any, { cardId }: { cardId: string }, context: Context) => {
    const credentials = await getCredentials(context)
    const author = await context.photon.trumpCards
      .findOne({
        where: { id: cardId },
      })
      .pack()
      .author()
    return (
      author != null && credentials.id != null && author.id == credentials.id
    )
  },
)

// TODO set up all permissions
const permissions = shield({
  Query: {},
  Mutation: {
    createOneTrumpCard: isAuthenticated,
    uploadTrumpCardImage: isTrumpCardOwner,
  },
})

const server = new GraphQLServer({
  schema,
  middlewares: [permissions],
  context: createContext,
})
server.express.use('/static/images', express.static(IMAGE_DIR))
server.start(
  {
    cors: {
      origin: process.env.CORS_ORIGIN || true,
    },
  },
  () =>
    console.log(
      `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql#5-using-the-graphql-api`,
    ),
)
