import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import RequiredFields from "../../../helper/RequiredFields";
import Property from "../../../domain/entity/Property";
import PropertyRepositoryPrisma from "../../../repository/prisma/PropertyRepositoryPrisma";
import GalleryRepositoryPrisma from "../../../repository/prisma/GalleryRepositoryPrisma";
import FolderRepositoryPrisma from "../../../repository/prisma/FolderRepositoryPrisma";
import Folder from "../../../domain/entity/Folder";

export default class FolderController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.register("post", "/api/v1/folders", async(params: Response, body: Request) => {
            const fields: string[] = ["company_id"];
            const { company_id } = body.body;
            const folderRepository = new FolderRepositoryPrisma(prisma);

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }
            
            return {
                body: await folderRepository.retrieveFolder(company_id),
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.register("post", "/api/v1/create-folder", async(params: Response, body: Request) => {
            const fields: string[] = ["name", "company_id"];
            const { company_id, name } = body.body;
            const folderRepository = new FolderRepositoryPrisma(prisma);

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            const folder: Folder = await Folder.createFolder(
                name,
                company_id
            );

            const createdFolder = await folderRepository.createFolder(folder);
            
            return {
                body: createdFolder,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.register("put", "/api/v1/folder/:id", async(params: Response | any, body: Request) => {
            const fields: string[] = ["name"];
            const folder_id: string = params.id;
            const { name } = body.body;
            const folderRepository = new FolderRepositoryPrisma(prisma);

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            const updatedFolder = await folderRepository.updateFolder(name, folder_id);

            return {
                body: updatedFolder,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);
    }
}