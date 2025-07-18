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

        it("Deve retornar erro 500 quando houver algum problema ao criar as memorias", async () => {
            mockRequest.body = {
                content: "Test memory",
                coverUrl: "http://example.com/img.png",
                isPublic: true,
            };

            (memoriesService.create as jest.Mock).mockRejectedValue(new Error())

            await MemoriesController.create(mockRequest as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(500)
            expect(mockReply.send).toHaveBeenCalledWith({ error: "An error occurred while creating the memory" })
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

        
        it("Deve retornar erro 500 quando houver algum problema ao buscar as memorias", async () => {

            (memoriesService.getAll as jest.Mock).mockRejectedValue(new Error())

            await MemoriesController.getAll(mockRequest as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(500)
            expect(mockReply.send).toHaveBeenCalledWith({ error: "An error occurred while fetching memories" })
        })

    })

    describe("Get Memory By ID Route", () => {
        it("Deve retornar uma memória específica pelo ID", async () => {
            const mockMemory = {
                id: "550e8400-e29b-41d4-a716-446655440000", // UUID válido
                content: "Memória de teste",
                coverUrl: "http://example.com/img.png",
                isPublic: true,
                userId: "test-user-id",
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const mockRequestWithParams = {
                user: { sub: "test-user-id" },
                params: { id: mockMemory.id },
                body: {},
            };

            (memoriesService.getById as jest.Mock).mockResolvedValue(mockMemory)

            await MemoriesController.getById(mockRequestWithParams as any, mockReply as any)
            
            expect(memoriesService.getById).toHaveBeenCalledWith(mockMemory.id)
            expect(mockReply.status).toHaveBeenCalledWith(200)
            expect(mockReply.send).toHaveBeenCalledWith(mockMemory)
        })

        
        it("Deve retornar erro 401 quando usuário não está autenticado", async () => {
            const mockRequestWithoutUser = { 
                user: null, 
                params: { id: "550e8400-e29b-41d4-a716-446655440000" },
                body: {} 
            }

            await MemoriesController.getById(mockRequestWithoutUser as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(401)
            expect(mockReply.send).toHaveBeenCalledWith({ error: 'Unauthorized' })
        })

    
        it("Deve retornar erro 400 quando ID não é um UUID válido", async () => {
            const mockRequestWithInvalidId = {
                user: { sub: "test-user-id" },
                params: { id: "invalid-id" }, // ID inválido
                body: {},
            };

            await MemoriesController.getById(mockRequestWithInvalidId as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                error: 'Invalid parameters',
                details: expect.any(Array)
            })
        })

        it("Deve retornar erro 404 quando memória não é encontrada", async () => {
            const mockRequestWithParams = {
                user: { sub: "test-user-id" },
                params: { id: "550e8400-e29b-41d4-a716-446655440000" },
                body: {},
            };

            (memoriesService.getById as jest.Mock).mockRejectedValue(new MemoryNotFoundError("Memory not found"))

            await MemoriesController.getById(mockRequestWithParams as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(404)
            expect(mockReply.send).toHaveBeenCalledWith({ error: "Memory not found" })
        })

    })

    describe("Update Memory Route", () => {
        
        it("Deve poder atualizar uma memoria existente", async () => {
            const mockMemoryId = "550e8400-e29b-41d4-a716-446655440000";
            const mockMemoryData = {
                content: "Updated memory",
                coverUrl: "http://example.com/img-updated.png",
                isPublic: false,
            }

            const mockUpdatedMemory = {
                id: mockMemoryId,
                ...mockMemoryData,
                userId: "test-user-id",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockRequestWithParamsAndBody = {
                user: { sub: "test-user-id" },
                params: { id: mockMemoryId },
                body: mockMemoryData,
            };

            (memoriesService.update as jest.Mock).mockResolvedValue(mockUpdatedMemory)

            await MemoriesController.updateMemory(mockRequestWithParamsAndBody as any, mockReply as any)

            expect(memoriesService.update).toHaveBeenCalledWith(mockMemoryId, mockMemoryData)
            expect(mockReply.status).toHaveBeenCalledWith(200)
            expect(mockReply.send).toHaveBeenCalledWith(mockUpdatedMemory)
        })

        it("Deve retonar erro 401 quando usuario não autorizado", async () => {
            const mockRequestWithoutUser = { 
                user: null, 
                params: { id: "550e8400-e29b-41d4-a716-446655440000" },
                body: {} 
            }

            await MemoriesController.updateMemory(mockRequestWithoutUser as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(401)
            expect(mockReply.send).toHaveBeenCalledWith({ error: 'Unauthorized' })
        })
        it("Deve retornar o 404 com o MemoryNotFoundError", async () => {
            const mockMemoryId = "550e8400-e29b-41d4-a716-446655440000";
            const mockRequestWithParamsAndBody = {
                user: { sub: "test-user-id" },
                params: { id: mockMemoryId },
                body: {
                    content: "Updated memory",
                    coverUrl: "http://example.com/img-updated.png",
                    isPublic: false,
                }
            };

            (memoriesService.update as jest.Mock).mockRejectedValue(new MemoryNotFoundError);

            await MemoriesController.updateMemory(mockRequestWithParamsAndBody as any, mockReply as any);

            expect(mockReply.status).toHaveBeenCalledWith(404);
            expect(mockReply.send).toHaveBeenCalledWith({ error: "Memória não encontrada" });
        });

        it("Deve retornar erro 400 quando dados são inválidos", async () => {
            mockRequest.body = {
                coverUrl: "http://example.com/img.png",
            }

            await MemoriesController.updateMemory(mockRequest as any, mockReply as any)

            expect(mockReply.status).toHaveBeenCalledWith(400)
            expect(mockReply.send).toHaveBeenCalledWith({
                error: 'Invalid data',
                details: expect.any(Array)

            })
        })

        it("Deve retornar erro 500 quando houver erro no lado do servidor", async () => {
            const mockRequestWithParamsAndBody = {
            user: { sub: "test-user-id" },
            params: { id: "550e8400-e29b-41d4-a716-446655440000" },
            body: {
                content: "Updated memory",
                coverUrl: "http://example.com/img-updated.png",
                isPublic: true,
            }
            };

            (memoriesService.update as jest.Mock).mockRejectedValue(new Error("An error occurred while updating the memory"));

            await MemoriesController.updateMemory(mockRequestWithParamsAndBody as any, mockReply as any);

            expect(mockReply.status).toHaveBeenCalledWith(500);
            expect(mockReply.send).toHaveBeenCalledWith({ error: "An error occurred while updating the memory" });
        })
    })

})


