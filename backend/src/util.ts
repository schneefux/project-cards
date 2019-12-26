import * as jwt from 'jsonwebtoken'
import { Context } from './context'

const JWT_SECRET = process.env.JWT_SECRET || ''

export const getUserId = async (context: Context) => {
  const token = context.request.get('Authorization')?.replace('Bearer ', '')
  let userId: string | null = null

  if (token !== undefined) {
    userId = ((await jwt.verify(token, JWT_SECRET)) as { id: string }).id
  }

  return userId
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
