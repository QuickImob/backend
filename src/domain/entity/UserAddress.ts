export default class UserAddress {
    id?: string;

    private constructor(
        id: string | undefined,
        readonly street: string,
        readonly street_n: string,
        readonly complement: string,
        readonly district: string,
        readonly city: string,
        readonly state: string,
        readonly country: string,
        readonly zip_code: string,
        readonly user_id: string,
    ) {
        this.id = id;
    }

    static async createUserAddress(
        street: string,
        street_n: string,
        complement: string,
        district: string,
        city: string,
        state: string,
        country: string,
        zip_code: string,
        user_id: string,
        id?: string
    ): Promise<UserAddress> {

        return new UserAddress(id,
            street,
            street_n,
            complement,
            district,
            city,
            state,
            country,
            zip_code,
            user_id
        );
    }
}