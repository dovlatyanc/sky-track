import { hash, compare } from 'bcrypt-ts'

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 10)
}

export const verifyPassword = async (password: string, hashed: string): Promise<boolean> => {
  return await compare(password, hashed)
}