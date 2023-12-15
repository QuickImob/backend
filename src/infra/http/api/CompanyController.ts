import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import CompanyRepositoryPrisma from "../../../repository/prisma/CompanyRepositoryPrisma";
import Company from "../../../domain/entity/Company";

export default class CompanyController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.register("post", "/api/v1/companies", async(params: Response, body: Request) => {
            const companyRepository = new CompanyRepositoryPrisma(prisma);

            const { name, email, phone, profile_image, type, user_id } = body.body;

            let compImg: string = '';
            if(profile_image){
                compImg = 'foto'
            }

            const company: Company= await Company.createCompany(
                name,
                email,
                phone,
                compImg,
                type,
                user_id
            );

            const createdCompany: any = await companyRepository.createCompany(company);

            return {
                body: createdCompany,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);
    }
}