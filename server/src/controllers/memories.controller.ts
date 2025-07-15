import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MemoriesServices } from "../services/memories.service";
import { CreateMemoryError, MemoryNotFoundError } from "../errors/memorie-error";

const memoriesService = new MemoriesServices();

export class MemoriesController {
    static async create(request: FastifyRequest, reply: FastifyReply) {
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
        });
        try {
            if (!request.user || !request.user.sub) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }
            const id = request.user.sub;
            const data = bodySchema.parse(request.body);
            const memory = await memoriesService.createMemory(id, data)

            return reply.status(201).send(memory);
        } catch (error) {
            if (error instanceof CreateMemoryError) {
                return reply.status(422).send({ error: error.message });
            }
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid data', details: error.errors });
            }
            return reply.status(500).send({ error: 'An error occurred while creating the memory' });
        }
    }
    static async getAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            if (!request.user || !request.user.sub) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }
            const id = request.user.sub;
            const memories = await memoriesService.getAllMemories(id);
            return reply.status(200).send(memories);
        } catch (error) {
            if (error instanceof MemoryNotFoundError) {
                return reply.status(404).send({ error: error.message });
            }
            return reply.status(500).send({ error: 'An error occurred while fetching memories' });
        }
    }
    static async getById(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        });
        try {
            const { id } = paramsSchema.parse(request.params);
            if (!request.user || !request.user.sub) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }
            const memory = await memoriesService.getMemoryById(id)
            return reply.status(200).send(memory);

        } catch (error) {
            if (error instanceof MemoryNotFoundError) {
                return reply.status(404).send({ error: error.message });
            }
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid parameters', details: error.errors });
            }
            return reply.status(500).send({ error: 'An error occurred while fetching the memory' });
        }
    }
}