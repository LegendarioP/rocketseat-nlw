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
            const memory = await memoriesService.create(id, data)

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
            const memories = await memoriesService.getAll(id);
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
            const memory = await memoriesService.getById(id)
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
    static async updateMemory(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });
        const bodySchema = z.object({
            content: z.string().optional(),
            coverUrl: z.string().optional(),
            isPublic: z.coerce.boolean().optional(),
        });
        try {
            const { id } = paramsSchema.parse(request.params);
            const data = bodySchema.parse(request.body);

            if (!request.user || !request.user.sub) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const updatedMemory = await memoriesService.update(id, data);
            return reply.status(200).send(updatedMemory);
            
        } catch (error) {
            if(error instanceof MemoryNotFoundError) {
                return reply.status(404).send({ error: error.message });
            }
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid data', details: error.errors });
            }
            if (error instanceof Error) {
                return reply.status(500).send({ error: error.message });
            }
        }
    }
    static async deleteMemory(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });
        try {
            const { id } = paramsSchema.parse(request.params);
            if (!request.user || !request.user.sub) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }
            const response = await memoriesService.delete(id);
            return reply.status(204).send(response);
        } catch (error) {
            if (error instanceof MemoryNotFoundError) {
                return reply.status(404).send({ error: error.message });
            }
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid parameters', details: error.errors });
            }
            return reply.status(500).send({ error: 'An error occurred while deleting the memory' });
        }
    }
}