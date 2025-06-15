import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthService } from '../services/auth.service'
import { z } from 'zod'

const authService = new AuthService()

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {

    const loginSchema = z.object({
        id: z.string().uuid(),
    })


    const { id } = loginSchema.parse(request.body)


    try {
        // const result = await authService.login(id, )
        
    } catch (error) {}
  }
}
