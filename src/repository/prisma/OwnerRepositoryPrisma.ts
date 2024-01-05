import {PrismaClient} from "@prisma/client";
import Owner from "../../domain/entity/Owner";

export default class OwnerRepositoryPrisma {

    constructor(readonly prisma: PrismaClient) {
    }

    async createOwner(owner: Owner): Promise<Owner> {
        const createdOwner: any = await this.prisma.owner.create({
            data: {
                name: owner.name,
                email: owner.email,
                phone: owner.phone,
                company_id: owner.company_id
            }
        });

        return createdOwner;
    }

    async updateOwner(owner: Owner): Promise<Owner> {
        const updatedOwner: any = await this.prisma.owner.update({
            where: {
                id: owner.id
            },
            data: {
                name: owner.name,
                email: owner.email,
                phone: owner.phone
            }
        });

        return updatedOwner;
    }

    async retrieveOwners(company_id: string): Promise<Owner | undefined> {
        const owners: any = await this.prisma.owner.findMany({
            where: {
                company_id: company_id
            }
        });

        return owners;
    }
}