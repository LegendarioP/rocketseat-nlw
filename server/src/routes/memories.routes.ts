import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middlewares/auth.middlewares'
import { MemoriesController } from '../controllers/memories.controller'

export async function memoriesRoutes(app: FastifyInstance) {
  app.post('/create', { preHandler: [authMiddleware] }, MemoriesController.create )
  app.get('/', { preHandler: [authMiddleware] }, MemoriesController.getAll )
  app.get('/:id', { preHandler: [authMiddleware] }, MemoriesController.getById )
  app.put('/:id', { preHandler: [authMiddleware] }, MemoriesController.updateMemory )
  app.delete('/:id', { preHandler: [authMiddleware] }, MemoriesController.deleteMemory )
  
  app.get('/public', MemoriesController.getPublicMemories)


}
