export default class Image {
    id?: string;

    private constructor(
        id: string | undefined,
        readonly company_id: string,
        readonly thumb: string,
        readonly url: string,
        readonly alt: string,
        readonly folder_id?: string,
    ) {
        this.id = id;
    }

    static async createImage(
        company_id: string,
        thumb: string,
        url: string,
        alt: string,
        folder_id?: string,
        id?: string
    ): Promise<Image> {

        return new Image(id,
            company_id,
            thumb,
            url,
            alt,
            folder_id
        );
    }
}