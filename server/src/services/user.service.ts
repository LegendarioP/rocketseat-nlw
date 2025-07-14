
import { CreateUserDTO } from "../dtos/user.dto";
import { UserAlreadyExistsError } from "../errors/user-error";
import { prisma } from "../utils/prisma";
import { generateRandomHexColor } from '../utils/color';



export class UserService {
    async create(data: CreateUserDTO){
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new UserAlreadyExistsError();
        }
        return await prisma.user.create({
            data: {
                ...data,
                color: generateRandomHexColor()
            }
        })
    }
}