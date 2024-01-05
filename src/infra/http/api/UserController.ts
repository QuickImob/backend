import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import User from "../../../domain/entity/User";
import UserRepositoryPrisma from "../../../repository/prisma/UserRepositoryPrisma";
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import UserAddress from "../../../domain/entity/UserAddress";
import RequiredFields from "../../../helper/RequiredFields";
import {GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import bcrypt from "bcrypt";

const storage = multer.memoryStorage();
const upload = multer({storage});

export default class UserController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.registerFile("post", "/api/v1/users", upload.single("profile_image"), async(params: Response, body: Request) => {
            const s3Client = new S3Client({});
            const userRepository = new UserRepositoryPrisma(prisma);
            const profile_image: any = body.file;

            const fields: string[] = ["name", "email", "phone", "password",
                "street", "street_n", "district", "city",
                "state", "country", "zip_code", "person_type"];

            const {
                name, email, phone, password,
                street, street_n, complement, district, city,
                state, country, zip_code, person_type
            } = body.body;

            const required: string[] = RequiredFields.validate(fields, body.body);
            if(required.length > 0){
                return {
                    body: required,
                    status: 422
                }
            }

            const existUser: any = await userRepository.retrieveUser(email);
            if(existUser){
                return {
                    body: "User already exists",
                    status: 400
                }
            }

            let userImg: any = '';
            if(profile_image){
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: "quickimob",
                        Key: profile_image.originalname,
                        Body: profile_image.buffer,
                    })
                );

                userImg = `https://quickimob.s3.sa-east-1.amazonaws.com/${profile_image.originalname.replace(/ /g, '%20')}`
            }

            const user: User = await User.createUser(
                name,
                email,
                phone,
                userImg,
                person_type,
                password
            );
            const createdUser: any = await userRepository.createUser(user);

            const userAddress: any = await UserAddress.createUserAddress(
                street,
                street_n,
                complement || '',
                district,
                city,
                state,
                country,
                zip_code,
                createdUser.id
            )
            const address: any = await userRepository.createUserAddress(userAddress);

            return {
                body: createdUser,
                status: 200
            }
        }, this.noAuth);

        httpServer.register("get", "/api/v1/users", async(params: Response, body: Request) => {
            const userRepository = new UserRepositoryPrisma(prisma);
            const retrieveUsers: any = await userRepository.retrieveUsers();

            return {
                body: retrieveUsers,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.registerFile("put", "/api/v1/users/:id", upload.single("profile_image"), async(params: Response | any, body: Request) => {
            const s3Client = new S3Client({});
            const userRepository = new UserRepositoryPrisma(prisma);
            const profile_image: any = body.file;
            const id: string = params.id;

            let userImg: any = '';
            if(profile_image){
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: "quickimob",
                        Key: profile_image.originalname,
                        Body: profile_image.buffer,
                    })
                );

                userImg = `https://quickimob.s3.sa-east-1.amazonaws.com/${profile_image.originalname.replace(/ /g, '%20')}`
            }

            const user: any = {
                user_id: id
            };
            if(body.body.name) Object.assign(user, {name: body.body.name})
            if(body.body.phone) Object.assign(user, {phone: body.body.phone})
            if(profile_image) Object.assign(user, {profile_image: userImg})

            const userAddress: any = {
                user_id: id
            };
            if(body.body.street) Object.assign(userAddress, {street: body.body.street})
            if(body.body.street_n) Object.assign(userAddress, {street_n: body.body.street_n})
            if(body.body.complement) Object.assign(userAddress, {complement: body.body.complement})
            if(body.body.district) Object.assign(userAddress, {district: body.body.district})
            if(body.body.city) Object.assign(userAddress, {city: body.body.city})
            if(body.body.state) Object.assign(userAddress, {state: body.body.state})
            if(body.body.country) Object.assign(userAddress, {country: body.body.country})
            if(body.body.zip_code) Object.assign(userAddress, {zip_code: body.body.zip_code})

            const updatedUser: any = await userRepository.updateUser(user);
            const updatedUserAddress: any = await userRepository.updateUserAddress(userAddress);

            return {
                body: updatedUser,
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);

        httpServer.registerFile("post", "/api/v1/change-password/:email", upload.single("profile_image"), async(params: Response | any, body: Request) => {
            const email: string = params.email;
            const userRepository = new UserRepositoryPrisma(prisma);

            const existUser: any = await userRepository.retrieveUser(email);
            if(!existUser){
                return {
                    body: "Invalid user or password",
                    status: 404
                }
            }

            const pass: boolean = await bcrypt.compare(body.body.password, existUser.password);

            if(!pass){
                return {
                    body: "Invalid password",
                    status: 404
                }
            }

            let crypted: string = await bcrypt.hash(body.body.new_password, 8);
            await userRepository.updateUserPassword(crypted, email);

            return {
                body: "Success",
                status: 200
            }
        }, MiddlewareAuth.middlewareAuth);
    }
}