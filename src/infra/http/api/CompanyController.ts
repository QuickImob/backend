import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import CompanyRepositoryPrisma from "../../../repository/prisma/CompanyRepositoryPrisma";
import Company from "../../../domain/entity/Company";
import RequiredFields from "../../../helper/RequiredFields";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({storage});

export default class CompanyController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.registerFile("post", "/api/v1/companies", upload.single("profile_image"), async(params: Response, body: Request) => {
            const s3Client = new S3Client({});
            const companyRepository = new CompanyRepositoryPrisma(prisma);

            const { name, email, phone, profile_image, type, user_id, document, creci } = body.body;
            const fields: string[] = ["name", "email", "phone", "type", "user_id"];

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            const existComp: any = await companyRepository.retrieveCompany(email);
            if(existComp){
                return {
                    body: "Company already exists",
                    status: 400
                }
            }

            let compImg: any = '';
            if(profile_image){
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: "quickimob",
                        Key: "/" + email + "/" + profile_image.originalname,
                        Body: profile_image.buffer,
                    })
                );

                compImg = `https://quickimob.s3.sa-east-1.amazonaws.com/${profile_image.originalname.replace(/ /g, '%20')}`
            }

            const company: Company= await Company.createCompany(
                name,
                email,
                phone,
                compImg,
                type,
                user_id
            );

            const createdCompany: any = await companyRepository.createCompany(company, document, creci);

            return {
                body: createdCompany,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);
    }
}