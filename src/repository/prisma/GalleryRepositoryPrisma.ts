import {PrismaClient} from "@prisma/client";
import User from "../../domain/entity/User";
import bcrypt from "bcrypt";
import Image from "../../domain/entity/Image";

interface Gallery {
    company_id: string,
    images: any,
}

export default class GalleryRepositoryPrisma {

    constructor(readonly prisma: PrismaClient) {
    }

    async retrieveGallery(company_id: string): Promise<any> {
        const gallery: any = await this.prisma.image.findMany({
            where: {
                company_id: company_id,
                folder_id: null
            }
        });

        return gallery;
    }

    async updateImageAlt(alt: string, image_id: string): Promise<any> {
        const updatedImage: any = await this.prisma.image.update({
            where: {
                id: image_id
            },
            data: {
                alt: alt
            }
        });

        return updatedImage;
    }

    async uploadImage(image: Image): Promise<any> {
        const createdImage: any = await this.prisma.image.create({
            data: {
                company_id: image.company_id,
                thumb: image.thumb,
                url: image.url,
                alt: image.alt,
                folder_id: image.folder_id ?? null
            }
        });

        return createdImage;
    }
}