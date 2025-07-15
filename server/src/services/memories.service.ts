import { CreateMemoryDTO, UpdateMemoryDTO } from "../dtos/memorie.dto";
import { CreateMemoryError, MemoryNotFoundError } from "../errors/memorie-error";
import { prisma } from "../utils/prisma";

export class MemoriesServices {
    async createMemory(userId:string, data: CreateMemoryDTO) {

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

    async getAllMemories(userId: string) {
        const memories = await prisma.memory.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!memories) {
            throw new MemoryNotFoundError("Memórias não encontradas");
        }

        return memories;
    }

    async getMemoryById(id: string) {
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

    async updateMemory(memoryId: string, data: UpdateMemoryDTO) {
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
    async deleteMemory(memoryId: string) {
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

}