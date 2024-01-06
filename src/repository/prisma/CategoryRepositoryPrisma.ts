import {PrismaClient} from "@prisma/client";
import Owner from "../../domain/entity/Owner";
import Category from "../../domain/entity/Category";

export default class CategoryRepositoryPrisma {

    constructor(readonly prisma: PrismaClient) {
    }

    async createCategory(category: Category): Promise<Category> {
        const createdCategory: any = await this.prisma.categories.create({
            data: {
                name: category.name,
                company_id: category.company_id
            }
        });

        return createdCategory;
    }

    async getCategories(company_id: string): Promise<Category> {
        const categories: any = await this.prisma.categories.findMany({
            where: {
                company_id: company_id
            }
        });

        return categories;
    }

    async getCategory(id: string): Promise<Category> {
        const categories: any = await this.prisma.categories.findUnique({
            where: {
                id: id
            }
        });

        return categories;
    }

    async updateCategory(category: Category): Promise<Category> {
        const updatedCategory: any = await this.prisma.categories.update({
            where: {
                id: category.id
            },
            data: category
        });

        return updatedCategory;
    }
}