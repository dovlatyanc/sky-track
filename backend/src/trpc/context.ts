import { type CreateExpressContextOptions } from '@trpc/server/adapters/express'
import jwt from 'jsonwebtoken'

export async function createContext({ req, res }: CreateExpressContextOptions) {
  let userId: string | null = null
  
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
      userId = decoded.id
    } catch (error) {
      console.log('Invalid token')
    }
  }
  
  return { userId, req, res }
}

export type Context = Awaited<ReturnType<typeof createContext>>