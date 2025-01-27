import { MailerTemplateInterface } from '../../../src/shared/interfaces';
import { MailerTemplateDatasource } from '../../../src/domain/datasource/mailerTemplate.datasource';
import { MailerTemplateDto } from '../../../src/domain/dtos/mailer/mailerTemplate.dto';
import { MailerTemplateSequelize } from '../../infrastructure/database/models/MailerTemplate';
import { CustomError } from '../../shared/errors/custom.error';

export class MailerTemplateDatasourceImpl implements MailerTemplateDatasource {
    async register(mailerTemplateDto: MailerTemplateDto): Promise<MailerTemplateInterface> {
        try {
            const [mailerTemplate, created] = await MailerTemplateSequelize.findOrCreate({
                where: {
                    abbreviation: mailerTemplateDto.abbreviation
                },
                defaults: {
                    name: mailerTemplateDto.name,
                    abbreviation: mailerTemplateDto.abbreviation,
                    doctype: mailerTemplateDto.doctype,
                    head: mailerTemplateDto.head,
                    header: mailerTemplateDto.header,
                    body: mailerTemplateDto.body ?? '',
                    footer: mailerTemplateDto.footer,
                }
            })

            // if the template already exists, update it
            if (!created) {
                await mailerTemplate.update({
                    doctype: mailerTemplateDto.doctype,
                    head: mailerTemplateDto.head,
                    header: mailerTemplateDto.header,
                    body: mailerTemplateDto.body ?? '',
                    footer: mailerTemplateDto.footer,
                });
            }

            return {
                name: mailerTemplate.name,
                abbreviation: mailerTemplate.abbreviation,
                doctype: mailerTemplate.doctype,
                head: mailerTemplate.head,
                header: mailerTemplate.header,
                body: mailerTemplate.body ?? '',
                footer: mailerTemplate.footer,
                id: mailerTemplate.id,
                createdAt: mailerTemplate.createdAt,
                updatedAt: mailerTemplate.updatedAt,
                deletedAt: mailerTemplate.deletedAt
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }

    async getById(id: number): Promise<MailerTemplateInterface> {
        try {
            const mailerTemplate = await MailerTemplateSequelize.findByPk(id);
            if (!mailerTemplate) {
                throw CustomError.notFound('Template not found');
            }
            return {
                name: mailerTemplate.name,
                abbreviation: mailerTemplate.abbreviation,
                doctype: mailerTemplate.doctype,
                head: mailerTemplate.head,
                header: mailerTemplate.header,
                body: mailerTemplate.body ?? '',
                footer: mailerTemplate.footer,
                id: mailerTemplate.id,
                createdAt: mailerTemplate.createdAt,
                updatedAt: mailerTemplate.updatedAt,
                deletedAt: mailerTemplate.deletedAt
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }

    async getByAbbreviation(abbreviation: string): Promise<MailerTemplateInterface> {
        try {
            const mailerTemplate = await MailerTemplateSequelize.findOne({
                where: {abbreviation}
            });
            if (!mailerTemplate) {
                throw CustomError.notFound('Template not found');
            }
            return {
                name: mailerTemplate.name,
                abbreviation: mailerTemplate.abbreviation,
                doctype: mailerTemplate.doctype,
                head: mailerTemplate.head,
                header: mailerTemplate.header,
                body: mailerTemplate.body ?? '',
                footer: mailerTemplate.footer,
                id: mailerTemplate.id,
                createdAt: mailerTemplate.createdAt,
                updatedAt: mailerTemplate.updatedAt,
                deletedAt: mailerTemplate.deletedAt
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
}