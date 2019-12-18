import { GraphQLServer } from 'graphql-yoga'
import { schema } from './schema'
import { createContext } from './context'

new GraphQLServer({ schema, context: createContext })
  .start({
    cors: {
      origin: process.env.CORS_ORIGIN || true
    }
  }, () =>
    console.log(
      `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql#5-using-the-graphql-api`,
    ),
)
