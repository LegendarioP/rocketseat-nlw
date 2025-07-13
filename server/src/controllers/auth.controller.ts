import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthService } from '../services/auth.service'
import { z } from 'zod'

const authService = new AuthService()

export class AuthController {
  static async login(request: FastifyRequest, reply: FastifyReply) {

    const loginSchema = z.object({
        id: z.string().uuid(),
    })

    const { id } = loginSchema.parse(request.body)
    
    try {
        const signJwt = request.server.jwt.sign
        console.log("to aqui")
        const result = await authService.login(id, signJwt)
        console.log('Login successful:', result)
      return reply.send(result)
        
    } catch (error) {
      console.log('Login error:', error)
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  }
}
