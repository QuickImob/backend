export default class RequiredFields {
    static validate(fields: string[], body: any): string[]{
        let required: string[] = [];

        fields.map((item: any) => {
            if(!body.hasOwnProperty(item)){
                required.push(item)
            }    
        })

        return required
    }
}