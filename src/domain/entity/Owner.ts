export default class Owner {
    id?: string;

    private constructor(
        id: string | undefined,
        readonly name: string,
        readonly email: string,
        readonly phone: string,
        readonly company_id: string,
    ) {
        this.id = id;
    }

    static async createOwner(
        name: string,
        email: string,
        phone: string,
        company_id: string,
        id?: string
    ): Promise<Owner> {

        return new Owner(id,
            name,
            email,
            phone,
            company_id,
        );
    }
}