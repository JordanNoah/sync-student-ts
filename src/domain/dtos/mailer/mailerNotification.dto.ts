export class MailerNotificationDto {
    constructor(
        public name: string,
        public abbreviation: string,
        public subject: string,
        public to: { beta: string[], production: string[] },
        public cc?: { beta: string[], production: string[] },
        public cco?: { beta: string[], production: string[] }
    ){}

    static create(object: {[key:string]:any}):[string?, MailerNotificationDto?]{
        const {name, abbreviation, subject, to, cc, cco} = object
        
        if(!object.name){
            return ['name is required']
        }

        if(!object.abbreviation){
            return ['abbreviation is required']
        }
        
        if(!object.subject){
            return ['subject is required']
        }

        if(!object.to){
            return ['to is required']
        }

        return [undefined, new MailerNotificationDto(
            object.name,
            object.abbreviation,
            object.subject,
            object.to,
            object.cc,
            object.cco
        )]
    }
}