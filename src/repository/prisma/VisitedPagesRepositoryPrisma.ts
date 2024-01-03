import {PrismaClient} from "@prisma/client";
import User from "../../domain/entity/User";
import bcrypt from "bcrypt";

export default class UserRepositoryPrisma {

    constructor(readonly prisma: PrismaClient) {
    }

    async visitedPage(user_id: string, url: string): Promise<any> {
        let data: any = {
            user_id: user_id
        };

        if(url === "dashboard") Object.assign(data, {dashboard: true})

        await this.prisma.visited_Page.upsert({
            where: {
                user_id: user_id
            },
            update: data,
            create: data
        });

        return true;
    }
}