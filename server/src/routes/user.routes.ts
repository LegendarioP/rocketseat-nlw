import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";


export async function userRoutes(app: FastifyInstance) {
    app.post('/register', UserController.create)
    // app.get('/register', UserController.get)
}