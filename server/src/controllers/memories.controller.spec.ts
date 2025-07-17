import { MemoriesController, memoriesService } from "./memories.controller"
import { CreateMemoryError, MemoryNotFoundError } from "../errors/memorie-error"

// Mock do service
jest.mock("../services/memories.service", () => ({
    MemoriesServices: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getPublicMemories: jest.fn(),
        getPublicMemoryById: jest.fn(),
    })),
}))

// Mock das funções do Fastify
const mockReply = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
}

const mockRequest = {
    user: { sub: "test-user-id" },
    body: {},
}

describe("MemoriesController", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("Create Route", () => {
        it("Deve criar uma memória com sucesso", async () => {
            // Arrange - Preparar os dados
            const mockMemoryData = {
                content: "Test memory",
                coverUrl: "http://example.com/img.png",
                isPublic: true,
            }

            const mockCreatedMemory = {
                id: "memory-id-123",
                ...mockMemoryData,
                userId: "test-user-id",
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            mockRequest.body = mockMemoryData;

            (memoriesService.create as jest.Mock).mockResolvedValue(mockCreatedMemory)

            await MemoriesController.create(mockRequest as any, mockReply as any)

            expect(memoriesService.create).toHaveBeenCalledWith("test-user-id", mockMemoryData)
            expect(mockReply.status).toHaveBeenCalledWith(201)
            expect(mockReply.send).toHaveBeenCalledWith(mockCreatedMemory)
        })

        it("Deve retornar erro 401 quando usuário não está autenticado", async () => {
            const mockRequestWithoutUser = { user: null, body: {} }

            await MemoriesController.create(mockRequestWithoutUser as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(401)

            expect(mockReply.send).toHaveBeenCalledWith({ error: 'Unauthorized' })
        })

        it("Deve retornar erro 422 quando o service lança CreateMemoryError", async () => {
            mockRequest.body = {
                content: "Test memory",
                coverUrl: "http://example.com/img.png",
                isPublic: true,
            };

            (memoriesService.create as jest.Mock).mockRejectedValue(new CreateMemoryError("Erro ao criar memória"))

            await MemoriesController.create(mockRequest as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(422)
            expect(mockReply.send).toHaveBeenCalledWith({ error: "Erro ao criar memória" })
        })

        it("Deve retornar erro 400 quando dados são inválidos", async () => {
            mockRequest.body = {
                coverUrl: "http://example.com/img.png",
                // content está faltando
            }

            await MemoriesController.create(mockRequest as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                error: 'Invalid data',
                details: expect.any(Array)
            })
        })
    })

    describe("Get All Memories Route", () => {
        it("Deve retornar todas as memórias do usuário autenticado", async () => {
            const mockMemories = [
                {
                    id: "memory-1",
                    content: "Primeira memória",
                    coverUrl: "http://example.com/img1.png",
                    isPublic: false,
                    userId: "test-user-id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: "memory-2", 
                    content: "Segunda memória",
                    coverUrl: "http://example.com/img2.png",
                    isPublic: true,
                    userId: "test-user-id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ];

            (memoriesService.getAll as jest.Mock).mockResolvedValue(mockMemories)

            await MemoriesController.getAll(mockRequest as any, mockReply as any)

            expect(memoriesService.getAll).toHaveBeenCalledWith("test-user-id")
            expect(mockReply.status).toHaveBeenCalledWith(200)
            expect(mockReply.send).toHaveBeenCalledWith(mockMemories)
        })

        it("Deve retornar erro 401 quando usuário não está autenticado", async () => {
            const mockRequestWithoutUser = { user: null, body: {} }

            await MemoriesController.getAll(mockRequestWithoutUser as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(401)
            expect(mockReply.send).toHaveBeenCalledWith({ error: 'Unauthorized' })
        })

        it("Deve retornar erro 404 quando memória não é encontrada", async () => {

            (memoriesService.getAll as jest.Mock).mockRejectedValue(new MemoryNotFoundError("Nenhuma memória encontrada"))

            await MemoriesController.getAll(mockRequest as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(404)
            expect(mockReply.send).toHaveBeenCalledWith({ error: "Nenhuma memória encontrada" })
        })

    })

})


