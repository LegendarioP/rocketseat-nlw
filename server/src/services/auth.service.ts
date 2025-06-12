import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'

export class AuthService {
  async login(id: string, app: FastifyInstance) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    })

    if (!user) {
      throw new Error('Usuario não encontrado')
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: '30 days',
      },
    )

    return { token }
  }
}
