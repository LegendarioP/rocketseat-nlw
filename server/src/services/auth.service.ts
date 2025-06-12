import { generateToken } from '../utils/jwt'
import { prisma } from '../utils/prisma'
import { FastifyInstance } from 'fastify'

export class AuthService {
  async login(id: string, app: FastifyInstance) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    })

    if (!user) {
      throw new Error('Usuario não encontrado')
    }

    const token = generateToken(app.jwt.sign, user)

    return { token }
  }
}
