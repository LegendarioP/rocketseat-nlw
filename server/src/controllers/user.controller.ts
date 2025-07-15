
import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../services/user.service";
import { z } from "zod";
import { UserAlreadyExistsError, UserDeleteError, UserNotFoundError } from "../errors/user-error";
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

    static async show(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })
        
        try {
            const { id } = paramsSchema.parse(request.params);
            const user = await userService.findById(id);
            return reply.status(200).send(user);
        } catch (error) {
            if(error instanceof UserNotFoundError) {
                return reply.status(404).send({ error: error.message });
            }
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid user Id', details: error.errors });
            }
            if (error instanceof Error) {
                return reply.status(500).send({ error: error.message });
            }
            return reply.status(500).send({ error: 'Unknown error' });
        }
    }

    static async list(request: FastifyRequest, reply: FastifyReply) {
        try {
            const users = await userService.list();
            return reply.status(200).send(users);
        } catch (error) {
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
    static async update(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })
        const bodySchema = z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            password: z.string().optional(),
            color: z.string().optional(),
            avatarUrl: z.string().optional(),
        })
        try {
            if (!request.user) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }
            const { id } = paramsSchema.parse(request.params);
            if (id !== request.user.sub) {
                return reply.status(403).send({ error: 'Forbidden' });
            }
            const data = bodySchema.parse(request.body);
            if(!data) { 
                return reply.status(400).send({ error: 'No data provided for update' });
            }
            const userUpdated = await userService.update(id, data);
            return reply.status(200).send(userUpdated);
            
        } catch (error) {
            if(error instanceof UserAlreadyExistsError){
                return reply.status(409).send({ error: error.message })
            }
            if (error instanceof UserNotFoundError) {
                return reply.status(404).send({ error: error.message });
            }
            return reply.status(500).send({ error: error});
        }
    }

    static async delete(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })
        try {
            if (!request.user) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }
            const { id } = paramsSchema.parse(request.params);
            if (id !== request.user.sub) {
                return reply.status(403).send({ error: 'Forbidden' });
            }
            const response = await userService.delete(id);
            return reply.status(204).send({response});
        } catch (error) {
            if (error instanceof UserDeleteError) {
                return reply.status(400).send({ error: error.message });
            }
            if (error instanceof UserNotFoundError) {
                return reply.status(404).send({ error: error.message });
            }
            return reply.status(500).send({ error: 'Internal Server Error' });
        }

    }

    static async me(request: FastifyRequest, reply: FastifyReply) {
        try {
            if(!request.user) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }
            const user = await userService.me(request.user.sub);
            return reply.status(200).send(user);
        } catch (error) {
            if(error instanceof UserNotFoundError) {
                return reply.status(404).send({ error: error.message });
            }
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
}