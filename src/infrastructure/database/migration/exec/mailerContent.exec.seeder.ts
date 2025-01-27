import { CustomError } from "../../../../shared/errors/custom.error";
import { MailerContentDatasourceImpl } from "../../../datasource/mailerContent.datasource.impl";
import { MailerContentDto } from "../../../../domain/dtos/mailer/mailerContent.dto";
import { MailerContentSeederData } from "../data/mailerContent.seeder";

export class MailerContentSeederExec {
    public async up() {
        try {
            for (const mailerContentData of MailerContentSeederData) {
                const [error, mailerContentDto] = MailerContentDto.create(mailerContentData);
                if (error) throw CustomError.internalSever(error)
                const mailerContent = mailerContentDto!
                await new MailerContentDatasourceImpl().register(mailerContent);
            }
        } catch (error) {
            throw CustomError.internalSever(`Error executing MailerContentSeeder: ${error}`);
        }
    }
}