import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import User from "../../../domain/entity/User";
import UserRepositoryPrisma from "../../../repository/prisma/UserRepositoryPrisma";
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import UserAddress from "../../../domain/entity/UserAddress";
import RequiredFields from "../../../helper/RequiredFields";

export default class UserController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.register("post", "/api/v1/users", async(params: Response, body: Request) => {
            const userRepository = new UserRepositoryPrisma(prisma);

            const fields: string[] = ["name", "email", "phone", "password",
                "street", "street_n", "district", "city",
                "state", "country", "zip_code", "person_type"];

            const {
                name, email, phone, profile_image, password,
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

            let userImg: string = '';
            if(profile_image){
                userImg = 'foto'
            }

            const user: User = await User.createUser(
                name,
                email,
                phone,
                userImg,
                password,
                person_type
            );

            await UserAddress.createUserAddress(
                street,
                street_n,
                complement,
                district,
                city,
                state,
                country,
                zip_code,
                user.id || ''
            )

            const createdUser: any = await userRepository.createUser(user);

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
    }
}