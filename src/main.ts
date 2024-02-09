import dotenv from "dotenv";
import HttpServer from "./infra/http/HttpServer";
import logger from "./infra/service/WinstonLogger";
import UserController from "./infra/http/api/UserController";
import LoginController from "./infra/http/api/LoginController";
import CompanyController from "./infra/http/api/CompanyController";
import VisitedPagesController from "./infra/http/api/VisitedPagesController";
import OwnerController from "./infra/http/api/OwnerController";
import CategoriesController from "./infra/http/api/CategoriesController";
import PropertyController from "./infra/http/api/PropertyController";
import GalleryController from "./infra/http/api/GalleryController";
import FolderController from "./infra/http/api/FolderController";

dotenv.config();

const httpServer = new HttpServer()
try {
    UserController.configureRoutes(httpServer);
    LoginController.configureRoutes(httpServer);
    CompanyController.configureRoutes(httpServer);
    VisitedPagesController.configureRoutes(httpServer);
    OwnerController.configureRoutes(httpServer);
    CategoriesController.configureRoutes(httpServer);
    PropertyController.configureRoutes(httpServer);
    GalleryController.configureRoutes(httpServer);
    FolderController.configureRoutes(httpServer);

    httpServer.listen(3001);
} catch (error) {
    console.error("Error on main.ts ", error)
    logger.error("Error on main.ts", error);
}
export const api = httpServer.app;

