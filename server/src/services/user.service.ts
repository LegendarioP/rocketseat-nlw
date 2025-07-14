
import { CreateUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { UserAlreadyExistsError, UserNotFoundError } from "../errors/user-error";
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

    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new UserNotFoundError();
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async update(id: string, data: UpdateUserDTO) {
        let user = await prisma.user.findUnique({
            where: { id }
        })
        if (!user) {
            throw new UserNotFoundError();
        }

        if (data.email && data.email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email }
            });
            if (existingUser) {
                throw new UserAlreadyExistsError("Email already in use");
            }
        }

        user = await prisma.user.update({
            where: { id },
            data
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword
    }                    

    async list(){
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                color: true,
                avatarUrl: true
            }
        });

        return users;
    }

    async me(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId }  
        })

        if (!user) {
            throw new UserNotFoundError();
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}