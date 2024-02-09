import {PrismaClient} from "@prisma/client";
import User from "../../domain/entity/User";
import bcrypt from "bcrypt";

interface Folder {
    company_id: string,
    name: string,
}

export default class FolderRepositoryPrisma {

    constructor(readonly prisma: PrismaClient) {
    }

    async retrieveFolder(company_id: string): Promise<any> {
        const folder: any = await this.prisma.folder.findMany({
            where: {
                company_id: company_id
            }
        });

        return folder;
    }

    async createFolder(folder: Folder): Promise<any> {
        const createdFolder: any = await this.prisma.folder.create({
            data: {
                company_id: folder.company_id,
                name: folder.name
            }
        });

        return createdFolder;
    }

    async updateFolder(name: string, folder_id: string): Promise<any> {
        const updatedFolder: any = await this.prisma.folder.update({
            where: {
                id: folder_id
            },
            data: {
                name: name
            }
        });

        return updatedFolder;
    }
}