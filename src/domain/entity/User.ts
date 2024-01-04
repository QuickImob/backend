import bcrypt from "bcrypt";

export default class User {
    id?: string;

    private constructor(
        id: string | undefined,
        readonly name: string,
        readonly email: string,
        readonly phone: string,
        readonly profile_image: string,
        readonly person_type: string,
        readonly password: string,
    ) {
        this.id = id;
    }

    static async createUser(
        name: string,
        email: string,
        phone: string,
        profile_image: string,
        person_type: string,
        password: string,
        id?: string
    ): Promise<User> {

        let crypted: string = await bcrypt.hash(password, 8)

        return new User(id,
            name,
            email,
            phone,
            profile_image,
            person_type,
            crypted
        );
    }
}