import {PrismaClient} from "@prisma/client";
import Company from "../../domain/entity/Company";

export default class CompanyRepositoryPrisma {

    constructor(readonly prisma: PrismaClient) {
    }

    async createCompany(company: Company): Promise<Company> {
        const createdCompany: any = await this.prisma.company.create({
            data: {
                id: company.id,
                name: company.name,
                profile_image: company.profile_image,
                phone: company.phone,
                email: company.email,
                type: company.type,
                user_id: company.user_id
            }
        });

        return createdCompany;
    }

    async retrieveCompany(email: string): Promise<Company | undefined> {
        const company: any = await this.prisma.company.findFirst({
            where: {
                email: email
            }
        });

        return company;
    }
}