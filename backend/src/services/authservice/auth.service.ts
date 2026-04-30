import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { prisma } from '../../../db/prisma'

export class AuthService {
  static async register(email: string, password: string, name?: string) {
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashed, name }
    })
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!)
    return { user, token }
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return null
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!)
    return { user, token }
  }

  static async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  }
}