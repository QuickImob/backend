export default class Category {
    id?: string;

    private constructor(
        id: string | undefined,
        readonly name: string,
        readonly company_id: string,
    ) {
        this.id = id;
    }

    static async createCategory(
        name: string,
        company_id: string,
        id?: string
    ): Promise<Category> {

        return new Category(id,
            name,
            company_id,
        );
    }
}