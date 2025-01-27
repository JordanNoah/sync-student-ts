export class MailerTemplateDto {
    constructor(
        public name: string,
        public abbreviation: string,
        public doctype: string,
        public head: string,
        public header: string,
        public body: string,
        public footer: string
    ){}

    static create(object: {[key: string]: any}): [string?, MailerTemplateDto?] {
        const { name, abbreviation, doctype, head, header, body, footer } = object;

        if(!object.name){
            return ['name is required'];
        }

        if(!object.abbreviation){
            return ['abbreviation is required'];
        }

        if(!object.doctype){
            return ['doctype is required'];
        }

        if(!object.head){
            return ['head is required'];
        }

        if(!object.header){
            return ['header is required'];
        }1

        if(!object.body){
            return ['body is required'];
        }

        return [undefined, new MailerTemplateDto(
            object.name,
            object.abbreviation,
            object.doctype,
            object.head,
            object.header,
            object.body,
            object.footer
        )]
    }
}