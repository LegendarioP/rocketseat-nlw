import { MemoriesServices } from "./memories.service"
import { prisma } from "../utils/prisma"
import { CreateMemoryError, MemoryNotFoundError } from "../errors/memorie-error"

// Mock do Prisma
jest.mock("../utils/prisma", () => ({
    prisma: {
        memory: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}))

// Tipagem correta do mock
const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe("MemoriesServices", () => {
    let service: MemoriesServices
    const testUserId = "test-user-id"

    beforeEach(() => {
        service = new MemoriesServices()
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("deve criar uma memória com sucesso", async () => {
            const mockMemoryData = {
                content: "Test memory",
                coverUrl: "http://example.com/img.png",
                isPublic: true,
            }

            const mockCreatedMemory = {
                id: "memory-id-123",
                ...mockMemoryData,
                userId: testUserId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            (mockPrisma.memory.create as jest.MockedFunction<any>).mockResolvedValue(mockCreatedMemory)

            const result = await service.create(testUserId, mockMemoryData)

            expect(mockPrisma.memory.create).toHaveBeenCalledWith({
                data: {
                    ...mockMemoryData,
                    userId: testUserId,
                },
            })
            expect(result).toEqual(mockCreatedMemory)
            expect(result).toHaveProperty("id")
        })

        it("deve lançar CreateMemoryError quando a criação falhar", async () => {
            const mockMemoryData = {
                content: "Test memory",
                coverUrl: "http://example.com/img.png",
                isPublic: true,
            };
            (mockPrisma.memory.create as jest.MockedFunction<any>).mockResolvedValue(null)

            await expect(service.create(testUserId, mockMemoryData)).rejects.toThrow(CreateMemoryError)
        })

        it('Deve retornar todas as memorias do usuario', async () => {
            const mockMemories = [
                {
                    "id": "1dbe87fb-77e7-47be-ad0a-a176098b0e19",
                    "coverUrl": "ToDelete,",
                    "content": "deleteTo",
                    "isPublic": false,
                    "createdAt": "2025-07-15T15:15:41.792Z",
                    "userId": testUserId
                },
                {
                    "id": "24491f49-1ecf-479a-9a0a-6fab00e1ff1e",
                    "coverUrl": "qwer",
                    "content": "asdf",
                    "isPublic": false,
                    "createdAt": "2025-07-15T14:22:57.694Z",
                    "userId": testUserId
                },
                {
                    "id": "3b9979b8-c548-4edb-9350-87b644b88af1",
                    "coverUrl": "yep",
                    "content": "hi",
                    "isPublic": true,
                    "createdAt": "2025-07-15T14:22:50.762Z",
                    "userId": testUserId
                }
            ];


            (mockPrisma.memory.findMany as jest.MockedFunction<any>).mockResolvedValue(mockMemories)

            const result = await service.getAll(testUserId)

            expect(mockPrisma.memory.findMany).toHaveBeenCalledWith({
                where: { userId: testUserId },
                orderBy: { createdAt: 'desc' }
            })
            expect(Array.isArray(result)).toBe(true);
            expect(result.every(mem => mem.hasOwnProperty("id"))).toBe(true);

        })

        it("Deve lançar o MemoryNotFoundError quando não encontrar memórias", async () => {
            (mockPrisma.memory.findMany as jest.MockedFunction<any>).mockResolvedValue([])

            await expect(service.getAll(testUserId)).rejects.toThrow(MemoryNotFoundError)
        })

        it("Deve retornar os dados da memoria por id", async () => {
            const mockMemory = {
                id: "memory-id-123",
                content: "Test memory",
                coverUrl: "http://example.com/img.png",
                isPublic: true,
                userId: testUserId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (mockPrisma.memory.findUnique as jest.MockedFunction<any>).mockResolvedValue(mockMemory)

            const result = await service.getById(mockMemory.id)

            expect(mockPrisma.memory.findUnique).toHaveBeenCalledWith({
                where: { id: mockMemory.id }
            })
            expect(result).toEqual(mockMemory)

        })

        it("Deve lançar MemoryNotFoundError quando não encontrar memória por id", async () => {
            (mockPrisma.memory.findUnique as jest.MockedFunction<any>).mockResolvedValue(null)

            await expect(service.getById("non-existent-id")).rejects.toThrow(MemoryNotFoundError)
        })

        it("Deve atualizar uma memória com sucesso", async () => {
            const mockMemoryId = "memory-id-123";
            const mockUpdateData = {
                content: "Updated memory",
                coverUrl: "http://example.com/updated.png",
                isPublic: false,
            };

            const mockUpdatedMemory = {
                id: mockMemoryId,
                ...mockUpdateData,
                userId: testUserId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (mockPrisma.memory.update as jest.MockedFunction<any>).mockResolvedValue(mockUpdatedMemory)

            const result = await service.update(mockMemoryId, mockUpdateData)

            expect(mockPrisma.memory.update).toHaveBeenCalledWith({
                where: { id: mockMemoryId },
                data: mockUpdateData,
            });
            expect(result).toEqual(mockUpdatedMemory);
        })


    })

})
