import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import RequiredFields from "../../../helper/RequiredFields";
import VisitedPagesRepositoryPrisma from "../../../repository/prisma/VisitedPagesRepositoryPrisma";

export default class VisitedPagesController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.register("post", "/api/v1/visit-page", async(params: Response, body: Request) => {
            const { url, user_id } = body.body;
            const fields: string[] = ["url", "user_id"];
            const visitedPagesRepository: any = new VisitedPagesRepositoryPrisma(prisma);

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            await visitedPagesRepository.visitedPage(user_id, url);

            return {
                body: "Success",
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);
    }
}