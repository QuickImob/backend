export default class Folder {
    id?: string;

    private constructor(
        id: string | undefined,
        readonly name: string,
        readonly company_id: string,
    ) {
        this.id = id;
    }

    static async createFolder(
        name: string,
        company_id: string,
        id?: string
    ): Promise<Folder> {

        return new Folder(id,
            name,
            company_id,
        );
    }
}