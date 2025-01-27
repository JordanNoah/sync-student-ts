export class MailerHistoryDto {
    constructor (
        public id: number,
        public uuid: string,
        public mailerNotificationId: number,
        public subject: string,
        public to: string,
        public cc: string,
        public cco: string,
        public body: string | null,
        public status: string,
        public attempts: number,
        public sentAt: Date | null
    ){}
}