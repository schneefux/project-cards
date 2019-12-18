import { Photon } from '@prisma/photon'
import { PubSub } from 'graphql-yoga'

const photon = new Photon()
const pubsub = new PubSub()

export interface Context {
  photon: Photon
  pubsub: PubSub
}

export function createContext(): Context {
  return {
    photon,
    pubsub,
  }
}
