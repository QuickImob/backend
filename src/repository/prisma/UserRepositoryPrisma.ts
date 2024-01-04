import {PrismaClient} from "@prisma/client";
import User from "../../domain/entity/User";
import bcrypt from "bcrypt";

export default class UserRepositoryPrisma {

    constructor(readonly prisma: PrismaClient) {
    }

    async createUser(user: User): Promise<any> {
        const createdUser: any = await this.prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profile_image: user.profile_image,
                person_type: user.person_type,
                password: user.password
            }
        });

        return {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            phone: createdUser.phone,
            profile_image: createdUser.profile_image,
            person_type: createdUser.person_type,
            type: createdUser.type
        };
    }

    async loginUser(email: string, password: string): Promise<User | undefined> {
        const user: any = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!await bcrypt.compare(password, user.password)){
            return undefined
        }

        return user;
    }

    async retrieveUsers(): Promise<any> {
        const user: any = await this.prisma.user.findMany();

        return user;
    }

    async retrieveUser(email: string): Promise<any> {
        const user: any = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });

        return user;
    }
}