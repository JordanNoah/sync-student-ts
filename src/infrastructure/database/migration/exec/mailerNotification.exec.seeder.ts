import { CustomError } from "../../../../shared/errors/custom.error";
import { MailerNotificationDatasourceImpl } from "../../../../infrastructure/datasource/mailerNotification.datasource.impl";
import { MailerNotificationDto } from "../../../../domain/dtos/mailer/mailerNotification.dto";
import { MailerNotificationSeederData } from "../data/mailerNotification.seeder";

export class MailerNotificationSeederExec {
    public async up() {
        try {
            const typeNotificationSeeder = MailerNotificationSeederData;
            for (const typeNotificationData of typeNotificationSeeder) {
                const [error, typeNotificationDto] = MailerNotificationDto.create(typeNotificationData);
                if (error) throw CustomError.internalSever(error)
                const typeNotification = typeNotificationDto!
                await new MailerNotificationDatasourceImpl().register(typeNotification);
            }
        } catch (error) {
            throw CustomError.internalSever(`Error executing TypeNotificationSeeder: ${error}`);
        }
    }
}