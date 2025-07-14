
import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../services/user.service";
import { z } from "zod";
import { UserAlreadyExistsError } from "../errors/user-error";
import { generateToken } from "../utils/jwt";

const userService = new UserService();

export class UserController {
    static async create(request: FastifyRequest, reply: FastifyReply) {
        const createUserSchema = z.object({
            githubId: z.number().optional(),
            name: z.string(),
            email: z.string(),
            password: z.string(),
            color: z.string().optional(),
            avatarUrl: z.string().optional(),
        });
        try {
            const data = createUserSchema.parse(request.body);
            const user = await userService.create(data);
            const token = generateToken(request.server.jwt.sign, user);
            return reply.code(201).send(token);
        } catch (error) {
            if (error instanceof UserAlreadyExistsError) {
                return reply.status(409).send({ error: error.message })
            }
            if (error instanceof Error) {
                return reply.status(400).send({ error: error.message })
            }
            return reply.status(400).send({ error: 'Unknown error' })
        }
    }
}