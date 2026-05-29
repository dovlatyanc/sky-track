import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { prisma } from '../../../db/prisma'

export class AuthService {
  static async register(email: string, password: string, name?: string) {
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashed, name }
    })
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    return { user, token }
  }

  static async login(email: string, password: string, rememberMe: boolean = false) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return null
    
    const expiresIn = rememberMe ? '30d' : '7d'
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn })
    
    return { user, token }
  }

  static async findById(id: string) {
    return prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        fullName: true,      
        phone: true,         
        passportNumber: true, 
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  static async updateProfile(
    userId: string,
    data: { fullName?: string; phone?: string; passportNumber?: string; name?: string }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        fullName: true,
        phone: true,
        passportNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }
}