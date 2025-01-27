import { MailerContentDto } from "../../domain/dtos/mailer/mailerContent.dto";
import { MailerContentInterface } from "../../shared/interfaces";

export abstract class MailerContentDatasource {
    abstract register(mailerContentDto: MailerContentDto): Promise<MailerContentInterface>;
    abstract getById(id: number): Promise<MailerContentInterface>;
    abstract getByAbbreviation(abbreviation: string): Promise<MailerContentInterface>;
}