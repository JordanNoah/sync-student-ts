import { CustomError } from "../../../../shared/errors/custom.error";
import { MailerTemplateDatasourceImpl } from "../../../datasource/mailerTemplate.datasource.impl";
import { MailerTemplateDto } from "../../../../domain/dtos/mailer/mailerTemplate.dto";
import { MailerTemplateSeederData } from "../data/mailerTemplate.seeder";

export class MailerTemplateSeederExec {
    public async up() {
        try {
            for (const mailerTemplateData of MailerTemplateSeederData) {
                const [error, mailerTemplateDto] = MailerTemplateDto.create(mailerTemplateData);
                if (error) throw CustomError.internalSever(error)
                const mailerTemplate = mailerTemplateDto!
                await new MailerTemplateDatasourceImpl().register(mailerTemplate);
            }
        } catch (error) {
            throw CustomError.internalSever(`Error executing MailerTemplateSeeder: ${error}`);
        }
    }
}
