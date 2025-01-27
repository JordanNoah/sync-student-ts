export class SendMailerDto{
    constructor(
        public to: string[],
        public subject: string,
        public body: string,
        public cc?: string[],
        public cco?: string[],
        public attachments?: { filename: string, path: string }[] 
    ){}

    static create(object: {[key: string]: any}): [string?, SendMailerDto?]{
        const { to, subject, body, cc, cco, attachments } = object;
        if(!object.to){
            return ['to is required'];
        }
        if(!object.subject){
            return ['subject is required'];
        }
        if(!object.body){
            return ['body is required'];
        }
        return [undefined, new SendMailerDto(
                object.to,
                object.subject,
                object.body,
                object.cc,
                object.cco,
                object.attachments
            )
        ];
    }
}