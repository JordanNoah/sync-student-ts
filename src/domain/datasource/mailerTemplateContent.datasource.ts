import { MailerTemplateContentDto } from "../dtos/mailer/mailerTemplateContent.dto";
import { MailerTemplateContentInterface } from "../../../src/shared/interfaces";

export abstract class MailerTemplateContentDatasource {
    abstract register(MailerTemplateContentDto: MailerTemplateContentDto): Promise<MailerTemplateContentInterface>;
    abstract getBlankHtml(templateAbbreviation: string, contentAbbreviation: string, notificationAbbreviation: string): Promise<string>;
}