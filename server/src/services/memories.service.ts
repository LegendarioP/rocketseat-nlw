import { CreateMemoryDTO } from "../dtos/memorie.dto";
import { CreateMemoryError } from "../errors/memorie-error";
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
}