import bcrypt from "bcrypt";

export default class User {
    id?: string;

    private constructor(
        id: string | undefined,
        readonly name: string,
        readonly email: string,
        readonly phone: string,
        readonly profile_image: string,
        readonly password: string,
        readonly perso_type: string,
    ) {
        this.id = id;
    }

    static async createUser(
        name: string,
        email: string,
        phone: string,
        profile_image: string,
        password: string,
        perso_type: string,
        id?: string
    ): Promise<User> {

        let crypted: string = await bcrypt.hash(password, 8)

        return new User(id,
            name,
            email,
            phone,
            profile_image,
            crypted,
            perso_type
        );
    }
}