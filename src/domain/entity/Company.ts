export default class Company {
    id?: string;

    private constructor(
        id: string | undefined,
        readonly name: string,
        readonly profile_image: string,
        readonly phone: string,
        readonly email: string,
        readonly type: string,
        readonly user_id: string,
    ) {
        this.id = id;
    }

    static async createCompany(
        name: string,
        profile_image: string,
        phone: string,
        email: string,
        type: string,
        user_id: string,
        id?: string
    ): Promise<Company> {

        return new Company(id,
            name,
            profile_image,
            phone,
            email,
            type,
            user_id,
        );
    }
}