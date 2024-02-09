import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import RequiredFields from "../../../helper/RequiredFields";
import Property from "../../../domain/entity/Property";
import PropertyRepositoryPrisma from "../../../repository/prisma/PropertyRepositoryPrisma";
import FolderRepositoryPrisma from "../../../repository/prisma/FolderRepositoryPrisma";
import Folder from "../../../domain/entity/Folder";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import GalleryRepositoryPrisma from "../../../repository/prisma/GalleryRepositoryPrisma";
import Image from "../../../domain/entity/Image";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({storage});

export default class PropertyController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.register("post", "/api/v1/property", async(params: Response, body: Request) => {
            const fields: string[] = ["title", "id_extern", "category_id", "user_id", "company_id", "owner_id"];
            const { title, id_extern, category_id, user_id, company_id, owner_id } = body.body;
            const propertyRepository = new PropertyRepositoryPrisma(prisma);
            const folderRepository = new FolderRepositoryPrisma(prisma);

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

            const folder: Folder = await Folder.createFolder(
                company_id,
                title
            );
            const createdProperty = await propertyRepository.createProperty(property);
            await folderRepository.createFolder(folder);

            return {
                body: createdProperty,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.registerFile("post", "/api/v1/property-image", upload.single("image"), async(params: Response, body: Request) => {
            const s3Client = new S3Client({});
            const fields: string[] = ["company_id", "image", "property_id"];
            const imageFile: any = body.file;
            const { company_id, property_id } = body.body;
            const galleryRepository = new GalleryRepositoryPrisma(prisma);

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            let imageUrl: any = '';
            if(imageFile){
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: "quickimob",
                        Key: "/" + company_id + "/" + imageFile.originalname,
                        Body: imageFile.buffer,
                    })
                );

                imageUrl = `https://quickimob.s3.sa-east-1.amazonaws.com/${imageFile.originalname.replace(/ /g, '%20')}`
            }

            const image: Image = await Image.createImage(
                company_id,
                '',
                imageUrl,
                '',
                property_id
            );

            return {
                body: await galleryRepository.uploadImage(image),
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);
    }
}