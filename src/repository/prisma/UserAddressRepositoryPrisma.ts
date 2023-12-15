import {PrismaClient} from "@prisma/client";
import User from "../../domain/entity/User";
import bcrypt from "bcrypt";
import UserAddress from "../../domain/entity/UserAddress";

export default class UserAddressRepositoryPrisma {

    constructor(readonly prisma: PrismaClient) {
    }

    async createAddress(address: UserAddress): Promise<UserAddress> {
        const userAddress: any = await this.prisma.user_Adress.create({
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

        return userAddress;
    }
}