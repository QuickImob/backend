import {PrismaClient} from "@prisma/client";
import User from "../../domain/entity/User";
import bcrypt from "bcrypt";

interface UserAddress {
    street: string,
    complement: string,
    district: string,
    city: string,
    state: string,
    country: string,
    zip_code: string,
    user_id: string,
    street_n: string
}

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

    async updateUser(user: any): Promise<any> {
        const createdUser: any = await this.prisma.user.update({
            where: {
                id: user.user_id
            },
            data: user
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

    async updateUserPassword(password: string, email: string): Promise<any> {
        const updatedUser: any = await this.prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: password
            }
        });

        return "Success";
    }

    async updateUserAddress(address: any): Promise<any> {
        const updatedUserAddress: any = await this.prisma.user_Adress.update({
            where: {
                user_id: address.user_id
            },
            data: address
        });

        return updatedUserAddress;
    }

    async createUserAddress(address: UserAddress): Promise<any> {
        const createdUserAddress: any = await this.prisma.user_Adress.create({
            data: {
                street: address.street,
                street_n: address.street_n,
                complement: address.complement,
                district: address.district,
                city: address.city,
                state: address.state,
                country: address.country,
                zip_code: address.zip_code,
                user_id: address.user_id
            }
        });

        return createdUserAddress;
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