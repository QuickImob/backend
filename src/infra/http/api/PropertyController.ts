import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import RequiredFields from "../../../helper/RequiredFields";
import Property from "../../../domain/entity/Property";
import PropertyRepositoryPrisma from "../../../repository/prisma/PropertyRepositoryPrisma";

export default class PropertyController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.register("post", "/api/v1/property", async(params: Response, body: Request) => {
            const fields: string[] = ["title", "id_extern", "category_id", "user_id", "company_id", "owner_id"];
            const { title, id_extern, category_id, user_id, company_id, owner_id } = body.body;
            const propertyRepository = new PropertyRepositoryPrisma(prisma);

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            const property: Property = await Property.createProperty(
                id_extern,
                title,
                '',
                category_id,
                '',
                0,
                0,
                owner_id,
                company_id,
                '',
                '',
                0,
                0,
                '',
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                '',
                user_id,
            );

            const createdRepository = await propertyRepository.createProperty(property);

            return {
                body: createdRepository,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);
    }
}