import { Photon } from '@prisma/photon'
import { PubSub } from 'graphql-yoga'
import { ContextParameters } from 'graphql-yoga/dist/types'

const photon = new Photon({
  datasources: !!process.env.DATABASE_URL
    ? {
        db: process.env.DATABASE_URL,
      }
    : {},
})
const pubsub = new PubSub()

export interface Context {
  photon: Photon
  pubsub: PubSub
  request: any
}

export async function createContext(
  context: ContextParameters,
): Promise<Context> {
  return {
    photon,
    pubsub,
    request: context.request,
  }
}
