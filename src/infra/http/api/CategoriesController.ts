import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import RequiredFields from "../../../helper/RequiredFields";
import OwnerRepositoryPrisma from "../../../repository/prisma/OwnerRepositoryPrisma";
import Owner from "../../../domain/entity/Owner";
import CategoryRepositoryPrisma from "../../../repository/prisma/CategoryRepositoryPrisma";
import Category from "../../../domain/entity/Category";

export default class CategoriesController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.register("post", "/api/v1/categories", async(params: Response, body: Request) => {
            const categoryRepository = new CategoryRepositoryPrisma(prisma);

            const fields: string[] = ["name", "company_id"];
            const { name, company_id } = body.body;

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            const category: Category = await Category.createCategory(
                name,
                company_id
            );

            const createdCategory: Category = await categoryRepository.createCategory(category);

            return {
                body: createdCategory,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.register("put", "/api/v1/category/:id", async(params: Response | any, body: Request) => {
            const categoryRepository = new CategoryRepositoryPrisma(prisma);
            const id = params.id;

            const fields: string[] = ["name"];
            const { name } = body.body;

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            const category: any = {
                id: id,
                name: name
            }

            const updatedCategory: Category = await categoryRepository.updateCategory(category);

            return {
                body: updatedCategory,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.register("get", "/api/v1/categories/:companyId", async(params: Response | any, body: Request) => {
            const categoryRepository = new CategoryRepositoryPrisma(prisma);
            const company_id = params.companyId;

            const getCategories: Category = await categoryRepository.getCategories(company_id);

            return {
                body: getCategories,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.register("get", "/api/v1/category/:id", async(params: Response | any, body: Request) => {
            const categoryRepository = new CategoryRepositoryPrisma(prisma);
            const id = params.id;

            const getCategory: Category = await categoryRepository.getCategory(id);

            return {
                body: getCategory,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);
    }
}