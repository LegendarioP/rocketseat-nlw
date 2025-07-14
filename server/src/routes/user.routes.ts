import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";


export async function userRoutes(app: FastifyInstance) {
    app.post('/register', UserController.create)
    app.get('/me', { preHandler: [authMiddleware]}, UserController.me)
    app.get('/:id', UserController.show)
    app.get('/', UserController.list)
}