export class MailerTemplateContentDto {
    constructor(
        public id: number,
        public mailerTemplateId: number,
        public mailerContentId: number,
        public mailerNotificationId: number
    ){}

    static create (object: {[key:string]: any}): [string?, MailerTemplateContentDto?]{
        const {id, mailerTemplateId, mailerContentId, mailerNotificationId} = object;

        if(!object.mailerTemplateId){
            return ['mailerTemplateId is required'];
        }

        if(!object.mailerContentId){
            return ['mailerContentId is required'];
        }

        if(!object.mailerNotificationId){
            return ['mailerNotificationId is required'];
        }

        return [undefined, new MailerTemplateContentDto(
            object.id,
            object.mailerTemplateId,
            object.mailerContentId,
            object.mailerNotificationId
        )]
    }
}