import { GraphQLServer } from 'graphql-yoga'
import { schema } from './schema'
import { createContext } from './context'
import * as express from 'express'

function shutdown() {
  // Any sync or async graceful shutdown procedures can be run before exiting…
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('SIGHUP', shutdown)

const server = new GraphQLServer({ schema, context: createContext })
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
