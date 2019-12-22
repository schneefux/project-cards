import * as express from 'express'
import { GraphQLServer } from 'graphql-yoga'
import { shield, rule } from 'graphql-shield'
import { schema } from './schema'
import { createContext, Context } from './context'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || ''

function shutdown() {
  // Any sync or async graceful shutdown procedures can be run before exiting…
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('SIGHUP', shutdown)

const getUserId = async (context: Context) => {
  const token = context.request.get('Authorization')?.replace('Bearer ', '')
  let userId: string | null = null

  if (token != null) {
    userId = ((await jwt.verify(token, JWT_SECRET)) as { id: string }).id
  }

  return userId
}

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent: any, args: any, context: Context) => {
    return (await getUserId(context)) != null
  },
)

const isTrumpCardOwner = rule({ cache: 'contextual' })(
  async (parent: any, { cardId }: { cardId: string }, context: Context) => {
    const userId = await getUserId(context)
    const author = await context.photon.trumpCards
      .findOne({
        where: { id: cardId },
      })
      .pack()
      .author()
    return author?.id == userId
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
server.express.use('/static/images', express.static('images'))
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
