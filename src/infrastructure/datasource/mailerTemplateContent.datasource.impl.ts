import { MailerTemplateContentDatasource } from '../../domain/datasource/mailerTemplateContent.datasource';
import { MailerTemplateContentSequelize } from '../database/models/MailerTemplateContent';
import { MailerTemplateContentDto } from '../../domain/dtos/mailer/mailerTemplateContent.dto';
import { MailerTemplateContentInterface } from '../../../src/shared/interfaces';
import { CustomError } from '../../shared/errors/custom.error';
import { MailerTemplateDatasourceImpl } from './mailerTemplate.datasource.impl';
import { MailerContentDatasourceImpl } from './mailerContent.datasource.impl';
import { MailerNotificationDatasourceImpl } from './mailerNotification.datasource.impl';
import { MailerTemplateInterface } from '../../../src/shared/interfaces';

export class MailerTemplateContentDatasourceImpl implements MailerTemplateContentDatasource {
    async register(mailerTemplateContentDto: MailerTemplateContentDto): Promise<MailerTemplateContentInterface> {
        try {
            const [mailerTemplateContent] = await MailerTemplateContentSequelize.findOrCreate({
                where: {
                    mailer_template_id: mailerTemplateContentDto.mailerTemplateId,
                    mailer_content_id: mailerTemplateContentDto.mailerContentId,
                    mailer_notification_id: mailerTemplateContentDto.mailerNotificationId
                },
                defaults: {
                    mailer_template_id: mailerTemplateContentDto.mailerTemplateId,
                    mailer_content_id: mailerTemplateContentDto.mailerContentId,
                    mailer_notification_id: mailerTemplateContentDto.mailerNotificationId
                }
            })

            return {
                id: mailerTemplateContent.id,
                templateId: mailerTemplateContent.mailer_template_id,
                contentId: mailerTemplateContent.mailer_content_id,
                mailerNotificationId: mailerTemplateContent.mailer_notification_id,
                createdAt: mailerTemplateContent.createdAt,
                updatedAt: mailerTemplateContent.updatedAt,
                deletedAt: mailerTemplateContent.deletedAt
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }

    async getBlankHtml(templateAbbreviation: string, contentAbbreviation: string, notificationAbbreviation: string): Promise<string> {
        try {

            const templateEntity = await new MailerTemplateDatasourceImpl().getByAbbreviation(templateAbbreviation);
            const contentEntity = await new MailerContentDatasourceImpl().getByAbbreviation(contentAbbreviation);
            const notificationEntity = await new MailerNotificationDatasourceImpl().getByAbbreviation(notificationAbbreviation);

            const exists = await MailerTemplateContentSequelize.findOne({
                where: {
                    mailer_template_id: templateEntity.id,
                    mailer_content_id: contentEntity.id,
                    mailer_notification_id: notificationEntity.id
                }
            });

            if (!exists) {
                throw CustomError.notFound('Template content not found');
            }
            //build html
            return this.assembleTemplate(templateEntity, contentEntity.bodyHeader, contentEntity.bodyDescription, contentEntity.body ?? '', contentEntity.bodyLastDescription);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }

    private assembleTemplate(mailerTemplate: MailerTemplateInterface, dynamicBodyHeader: string, dynamicBodyDescription: string, dynamicBody: string, dynamicBodyLastDescription: string): string {
        return `
        ${mailerTemplate.doctype}
        ${mailerTemplate.head}
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Open Sans', sans-serif;" bgcolor="#F5F5F5">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f5f5;" bgcolor="#F5F5F5">
                <tr>
                    <td align="center">
                        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 24px; text-align: center;">
                                    ${mailerTemplate.header}
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: #fafafa; padding: 24px 0; text-align: center;">
                                    ${dynamicBodyHeader}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 24px;">
                                    ${dynamicBodyDescription}
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="1" style="border-collapse: collapse; border-color: #e0e0e0; font-family: 'Open Sans', sans-serif; font-size: 12px; color: #424242;">
                                        ${dynamicBody}
                                    </table>
                                    <div style="margin-top: 20px; font-family: 'Open Sans', sans-serif; font-size: 12px; color: #424242;">
                                        ${dynamicBodyLastDescription}
                                    <div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 24px 24px 24px; text-align: center;">
                                    ${mailerTemplate.footer}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
        </table>
        </body></html>
        `;
    }
}