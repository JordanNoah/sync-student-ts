import { CustomError } from "../../../../shared/errors/custom.error";
import { MailerContentDatasourceImpl } from "../../../../infrastructure/datasource/mailerContent.datasource.impl";
import { MailerNotificationDatasourceImpl } from "../../../../infrastructure/datasource/mailerNotification.datasource.impl";
import { MailerTemplateDatasourceImpl } from "../../../../infrastructure/datasource/mailerTemplate.datasource.impl";
import { MailerTemplateContentDatasourceImpl } from "../../../../infrastructure/datasource/mailerTemplateContent.datasource.impl";
import { MailerTemplateContentDto } from "../../../../domain/dtos/mailer/mailerTemplateContent.dto";
import { MailerTemplateContentSeederData } from "../../migration/data/mailerTemplateContent.seeder";

export class MailerTemplateContentSeederExec {
    public async up() {
        try {
            for (const mailerConnectData of MailerTemplateContentSeederData) {

                //get type notification
                const notificationEntity = await new MailerNotificationDatasourceImpl().getByAbbreviation(mailerConnectData.notificationAbbreviation);
                if (!notificationEntity) throw CustomError.internalSever(`Notification ${mailerConnectData.notificationAbbreviation} not found`);

                // get template base
                const templateEntity = await new MailerTemplateDatasourceImpl().getByAbbreviation(mailerConnectData.templateAbbreviation);
                if (!templateEntity) throw CustomError.internalSever(`Template ${mailerConnectData.templateAbbreviation} not found`);

                // get content notification
                const contentEntity = await new MailerContentDatasourceImpl().getByAbbreviation(mailerConnectData.contentAbbreviation);
                if (!contentEntity) throw CustomError.internalSever(`Content ${mailerConnectData.contentAbbreviation} not found`);

                const [error, mailerConnectDto] = MailerTemplateContentDto.create({
                    mailerTemplateId: templateEntity.id,
                    mailerContentId: contentEntity.id,
                    mailerNotificationId: notificationEntity.id,
                });

                if (error) throw CustomError.internalSever(error);

                const mailerConnect = mailerConnectDto!;
                await new MailerTemplateContentDatasourceImpl().register(mailerConnect);
            }
        } catch (error) {
            console.error(`Error executing MailerConnectSeeder: ${error}`);
            throw CustomError.internalSever(`Error executing MailerConnectSeeder: ${error}`);
        }
    }
}