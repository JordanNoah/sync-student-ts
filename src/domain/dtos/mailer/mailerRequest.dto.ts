import { UserInterface } from "../../../shared/interfaces";

export class MailerRequestDto {
    constructor(
        public studentInterface: UserInterface,
        public notificationAbbreviation: string,
        public templateAbbreviation: string,
        public contentAbbreviation: string,
        public to: string[],
        public cc?: string[],
        public bcc?: string[],
        public cco?: string[],
        public placeholders?: {[key: string]: any},
    ){}

    static create(object: {[key: string]: any}): [string?, MailerRequestDto?] {
        const { studentInterface, notificationAbbreviation, templateAbbreviation, contentAbbreviation, to, cc, bcc, cco, placeholders } = object;
        
        if(!object.studentInterface){
            return ['studentInterface is required'];
        }
        if(!object.notificationAbbreviation){
            return ['notificationAbbreviation is required'];
        }
        if(!object.templateAbbreviation){
            return ['templateAbbreviation is required'];
        }
        if(!object.contentAbbreviation){
            return ['contentAbbreviation is required'];
        }
        if(!object.to){
            return ['to is required'];
        }
        
        return [undefined, new MailerRequestDto(
            object.studentInterface,
            object.notificationAbbreviation, 
            object.templateAbbreviation, 
            object.contentAbbreviation, 
            object.to, 
            object.cc, 
            object.bcc, 
            object.cco, 
            object.placeholders
        )];
    }
}