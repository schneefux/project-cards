import * as jwt from 'jsonwebtoken'
import { Context } from './context'
import { SubscriptionTier } from '@prisma/photon'

export const JWT_SECRET = process.env.JWT_SECRET || ''

export interface JwtCredentials {
  id: string | null
  subscriptionTier: SubscriptionTier | null
}

export async function getCredentials(
  context: Context,
): Promise<JwtCredentials> {
  const token = context.request.get('Authorization')?.replace('Bearer ', '')
  if (token == undefined) {
    return { id: null, subscriptionTier: null }
  }

  return (await jwt.verify(token, JWT_SECRET)) as JwtCredentials
}

export function shuffle<T>(array: T[]): T[] {
  let counter = array.length

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter)

    // Decrease counter by 1
    counter--

    // And swap the last element with it
    let temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }

  return array
}
