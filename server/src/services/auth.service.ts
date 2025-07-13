import { generateToken } from '../utils/jwt'
import { prisma } from '../utils/prisma'
import { JwtSignFunction } from '../types/jwt-types'

export class AuthService {
  async login(id: string, signJwt: JwtSignFunction) {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    if (!user) {
      throw new Error('Usuario não encontrado')
    }
    const token = generateToken(signJwt, user)
    return { token }
  }
}
