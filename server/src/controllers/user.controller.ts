import { FastifyRequest, FastifyReply } from "fastify";

export class UserController {
    static async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            // create of service to controller
            // return reply.code(200).send('hi')
        } catch (error) {
            if (error instanceof Error) {
                return reply.status(400).send({ error: error.message })
            } else {
                return reply.status(400).send({ error: 'Unknown error' })
            }
        }
        // return reply.code(200).send('hi')
    }
    // static async get(request: FastifyRequest, reply: FastifyReply) {
    //     return reply.code(200).send('Página de registro');
    // }
}