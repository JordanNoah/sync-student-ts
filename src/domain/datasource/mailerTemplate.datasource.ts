import { MailerTemplateDto } from '../../domain/dtos/mailer/mailerTemplate.dto';
import { MailerTemplateInterface } from '../../../src/shared/interfaces';

export abstract class MailerTemplateDatasource {
    abstract register (mailerTemplateDto: MailerTemplateDto): Promise<MailerTemplateInterface>;
    abstract getById (id: number): Promise<MailerTemplateInterface>;
    abstract getByAbbreviation (abbreviation: string): Promise<MailerTemplateInterface>;
}