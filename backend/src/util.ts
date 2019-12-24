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
