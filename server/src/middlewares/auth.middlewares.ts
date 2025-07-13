import { FastifyReply, FastifyRequest } from 'fastify'

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify()
  } catch (error) {
    console.error('Authentication error:', error)
    return reply.status(401).send({ error: 'Unauthorized' })
  }
}
