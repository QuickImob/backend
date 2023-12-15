import HttpServer from "../HttpServer";
import {Request, Response} from 'express';
import User from "../../../domain/entity/User";
import UserRepositoryPrisma from "../../../repository/prisma/UserRepositoryPrisma";
import {prisma} from "../../database/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default class LoginController {
    private static noAuth = (req: any, res: any, next: any) => {
        next()
    };

    static configureRoutes(httpServer: HttpServer) {
        httpServer.register("post", "/api/v1/login", async(params: Response, body: Request) => {
            const userRepository = new UserRepositoryPrisma(prisma);
            const { email, password } = body.body;

            const user: User | undefined = await userRepository.loginUser(email, password);

            if(!user){
                return {
                    body: 'Unauthorized',
                    status: 403
                }
            }

            const secret: string = process.env.SECRET || '';
            const token: any = jwt.sign({
                user: user
            }, secret, {expiresIn: '1h'})

            return {
                body: {
                    user_id: user.id,
                    token: token
                },
                status: 200
            }
        }, this.noAuth);
    }
}