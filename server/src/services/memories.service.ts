import { CreateMemoryDTO, UpdateMemoryDTO } from "../dtos/memorie.dto";
import { CreateMemoryError, MemoryNotFoundError } from "../errors/memorie-error";
import { prisma } from "../utils/prisma";

export class MemoriesServices {
    async create(userId:string, data: CreateMemoryDTO) {

        const memory = await prisma.memory.create({
            data: {
                ...data,
                userId: userId
            }
        })
        if (!memory) {
            throw new CreateMemoryError();
        }
        return memory;
    }

    async getAll(userId: string) {
        const memories = await prisma.memory.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!memories || memories.length === 0) {
            throw new MemoryNotFoundError("Memórias não encontradas");
        }

        return memories;
    }

    async getById(id: string) {
        const memory = await prisma.memory.findUnique({
            where: {
                id
            }
        });
        if (!memory) {
            throw new MemoryNotFoundError();
        }
        return memory;
    }

    async update(memoryId: string, data: UpdateMemoryDTO) {
        const memory = await prisma.memory.update({
            where: {
                id: memoryId
            },
            data: {
                ...data
            }
        });
        if (!memory) {
            throw new MemoryNotFoundError();
        }
        return memory;
    }

    async delete(memoryId: string) {
        const memory = await prisma.memory.delete({
            where: {
                id: memoryId
            }
        });
        if (!memory) {
            throw new MemoryNotFoundError();
        }
        return { message: 'Memory deleted successfully' };
    }

    async getPublicMemories(){
        const memories = await prisma.memory.findMany({
            where: {
                isPublic: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!memories) {
            throw new MemoryNotFoundError("Public memories not found");
        }

        return memories;
    }
    
    async getPublicMemoryById(id: string) {
        const memory = await prisma.memory.findUnique({
            where: {
                id,
                isPublic: true
            }
        });

        if (!memory) {
            throw new MemoryNotFoundError("Memoria Publica não encontrada");
        }

        return memory;
    }
}