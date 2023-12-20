import express, { Express } from "express";
import logger from "../service/WinstonLogger";
import cors from 'cors';

export default class HttpServer {
    app: any

    constructor(app: Express = express()) {
        this.app = app;
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
        this.app.use(cors({
            origin: '*',
            credentials: true
        }));
    }

    register(method: string, path: string, handler: Function, checkAuth: Function): void {
        this.app[method](path, checkAuth, this.handler(handler))
    }

    listen(port: number): void {
        this.app.listen(port, () => {
            logger.info(`Example app listening at http://localhost:${port}`)
        })
    }

    private handler(handler: Function) {
        return async function (req: any, res: any) {
            try {
                const result = await handler(req.params, req);

                if (result.status && result.body) {
                    res.status(result.status).send(result.body);
                } else {
                    res.send(result);
                }
            } catch (error: any) {
                logger.error("Error handler:", error);
                if (error instanceof Error) {
                    res.status(400).send({error: error.message});
                    return;
                }
            }
        };
    }
}