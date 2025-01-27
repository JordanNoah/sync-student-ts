import { MailerNotificationDto } from "../../../src/domain/dtos/mailer/mailerNotification.dto";
import { MailerNotificationInterface } from "../../../src/shared/interfaces";

export abstract class MailerNotificationDatasource {
    abstract register(typeNotificationDto: MailerNotificationDto): Promise<MailerNotificationInterface>;
    abstract getByAbbreviation(abbreviation: string): Promise<MailerNotificationInterface>;
}