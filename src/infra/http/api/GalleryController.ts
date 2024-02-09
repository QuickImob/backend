import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import RequiredFields from "../../../helper/RequiredFields";
import Property from "../../../domain/entity/Property";
import PropertyRepositoryPrisma from "../../../repository/prisma/PropertyRepositoryPrisma";
import GalleryRepositoryPrisma from "../../../repository/prisma/GalleryRepositoryPrisma";
import multer from "multer";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import Image from "../../../domain/entity/Image";

const storage = multer.memoryStorage();
const upload = multer({storage});

export default class GalleryController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.register("post", "/api/v1/gallery", async(params: Response, body: Request) => {
            const fields: string[] = ["company_id"];
            const { company_id } = body.body;
            const galleryRepository = new GalleryRepositoryPrisma(prisma);

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            return {
                body: await galleryRepository.retrieveGallery(company_id),
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.registerFile("post", "/api/v1/image-gallery", upload.single("image"), async(params: Response, body: Request) => {
            const s3Client = new S3Client({});
            const fields: string[] = ["company_id", "image"];
            const imageFile: any = body.file;
            const { company_id } = body.body;
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
            );

            return {
                body: await galleryRepository.uploadImage(image),
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.register("put", "/api/v1/image-gallery/:id", async(params: Response | any, body: Request) => {
            const fields: string[] = ["alt"];
            const { alt } = body.body;
            const image_id: string = params.id;
            const galleryRepository = new GalleryRepositoryPrisma(prisma);

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            return {
                body: await galleryRepository.updateImageAlt(alt, image_id),
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);
    }
}