
import { CreateUserDTO } from "../dtos/user.dto";
import { UserAlreadyExistsError } from "../errors/user-error";
import { generateToken } from "../utils/jwt";
import { prisma } from "../utils/prisma";



export class UserService {
    async create(data: CreateUserDTO){
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new UserAlreadyExistsError();
        }
        // return 
        return await prisma.user.create({
            data
        })

        // prosseguir com a criação do usuário normalmente
        // return await prisma.user.create({ data });
    }
}