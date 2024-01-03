import {PrismaClient} from "@prisma/client";
import Company from "../../domain/entity/Company";

export default class CompanyRepositoryPrisma {

    constructor(readonly prisma: PrismaClient) {
    }

    async createCompany(company: Company, document: string, creci: string): Promise<Company> {
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

        if(company.type === 'PF'){
            await this.prisma.legal_Person_Company.create({
                data: {
                    cnpj: document,
                    creci_j: creci,
                    company_id: createdCompany.id
                }
            });
        } else {
            await this.prisma.physical_Person_Company.create({
                data: {
                    cpf: document,
                    creci: creci,
                    company_id: createdCompany.id
                }
            });
        }

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