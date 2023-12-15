import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import User from "../../../domain/entity/User";
import UserRepositoryPrisma from "../../../repository/prisma/UserRepositoryPrisma";
import {prisma} from "../../database/client";
import MiddlewareAuth from "../../../service/MiddlewareAuth";
import UserAddress from "../../../domain/entity/UserAddress";
import CompanyRepositoryPrisma from "../../../repository/prisma/CompanyRepositoryPrisma";

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

            const user: User = await User.createUser(
                name,
                email,
                phone,
                compImg,
                type,
                user_id
            );

            /*await UserAddress.createUserAddress(
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

            const createdUser: any = await userRepository.createUser(user);*/

            return {
                body: "createdUser",
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