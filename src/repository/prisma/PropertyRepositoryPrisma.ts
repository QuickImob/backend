import {PrismaClient} from "@prisma/client";
import Property from "../../domain/entity/Property";

export default class PropertyRepositoryPrisma {

    constructor(readonly prisma: PrismaClient) {
    }

    async createProperty(property: Property): Promise<Property> {
        const createdProperty: any = await this.prisma.property.create({
            data: {
                id_extern: property.id_extern,
                title: property.title,
                description: property.description,
                category_id: property.category_id,
                property_registration: property.property_registration,
                condominium: property.condominium,
                iptu: property.iptu,
                owner_id: property.owner_id,
                company_id: property.company_id,
                constructed_area: property.constructed_area,
                total_area: property.total_area,
                sell_price: property.sell_price,
                rent_price: property.rent_price,
                objective: property.objective,
                n_bedrooms: property.n_bedrooms,
                n_suites: property.n_suites,
                n_bathrooms: property.n_bathrooms,
                n_parking: property.n_parking,
                n_parking_free: property.n_parking_free,
                n_washrooms: property.n_washrooms,
                n_elevators: property.n_elevators,
                n_paviments: property.n_paviments,
                link_tour: property.link_tour,
                user_id: property.user_id
            }
        });

        return createdProperty;
    }
}