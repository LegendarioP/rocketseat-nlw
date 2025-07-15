import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middlewares/auth.middlewares'
import { MemoriesController } from '../controllers/memories.controller'

export async function memoriesRoutes(app: FastifyInstance) {
  app.post('/create', { preHandler: [authMiddleware] }, MemoriesController.create )}
