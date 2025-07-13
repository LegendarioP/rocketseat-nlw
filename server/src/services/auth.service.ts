import { generateToken } from '../utils/jwt'
import { prisma } from '../utils/prisma'
import { JwtSignFunction } from '../types/jwt-types'

export class AuthService {
  async login(id: string, signJwt: JwtSignFunction) {
    console.log(id)

    console.log("erro no service")

    const user = await prisma.user.findUnique({
      where: { id },
    })

    console.log('User found:', user)
    if (!user) {
      throw new Error('Usuario não encontrado')
    }

    const token = generateToken(signJwt, user)

    return { token }
  }
}
