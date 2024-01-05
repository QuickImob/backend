import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import RequiredFields from "../../../helper/RequiredFields";
import OwnerRepositoryPrisma from "../../../repository/prisma/OwnerRepositoryPrisma";
import Owner from "../../../domain/entity/Owner";

export default class OwnerController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.register("post", "/api/v1/owners", async(params: Response, body: Request) => {
            const ownerRepository = new OwnerRepositoryPrisma(prisma);
            const { name, email, phone, company_id } = body.body;

            const fields: string[] = ["company_id"];
            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            const owner: Owner = await Owner.createOwner(
                name,
                email,
                phone,
                company_id
            );

            const createdOwner: any = await ownerRepository.createOwner(owner);

            return {
                body: createdOwner,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.register("put", "/api/v1/owners/:id", async(params: Response | any, body: Request) => {
            const ownerRepository = new OwnerRepositoryPrisma(prisma);
            const id = params.id;
            const { name, email, phone } = body.body;

            const owner: any = {
                id: id
            };
            if(name) Object.assign(owner, {name: name})
            if(email) Object.assign(owner, {email: email})
            if(phone) Object.assign(owner, {phone: phone})

            const updatedOwner: any = await ownerRepository.updateOwner(owner);

            return {
                body: updatedOwner,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.register("get", "/api/v1/owners/:company_id", async(params: Response | any, body: Request) => {
            const ownerRepository = new OwnerRepositoryPrisma(prisma);
            const company_id = params.company_id;

            if(!company_id){
                return {
                    body: "Company_id is required",
                    status: 404
                }
            }

            const owners: any = await ownerRepository.retrieveOwners(company_id);

            return {
                body: owners,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);
    }
}