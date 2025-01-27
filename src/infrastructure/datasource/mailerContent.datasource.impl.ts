import { MailerContentDatasource } from '../../domain/datasource/mailerContent.datasource';
import { MailerContentDto } from '../../domain/dtos/mailer/mailerContent.dto';
import { MailerContentInterface } from '../../shared/interfaces';
import { MailerContentSequelize } from '../database/models/MailerContent';
import { CustomError } from '../../shared/errors/custom.error';

export class MailerContentDatasourceImpl implements MailerContentDatasource {
    async register(mailerContentDto: MailerContentDto): Promise<MailerContentInterface> {
        try {
            const [mailerContent, created] = await MailerContentSequelize.findOrCreate({
                where: {
                    abbreviation: mailerContentDto.abbreviation
                },
                defaults: {
                    name: mailerContentDto.name,
                    abbreviation: mailerContentDto.abbreviation,
                    body_header: mailerContentDto.bodyHeader,
                    body_description: mailerContentDto.bodyDescription,
                    body: mailerContentDto.body ?? '',
                    body_last_description: mailerContentDto.bodyLastDescription
                }
            });
    
            // if the template already exists, update it
            if (!created) {
                await mailerContent.update({
                    body_header: mailerContentDto.bodyHeader,
                    body_description: mailerContentDto.bodyDescription,
                    body: mailerContentDto.body ?? '',
                    body_last_description: mailerContentDto.bodyLastDescription
                });
            }

            return {
                id: mailerContent.id,
                name: mailerContent.name,
                abbreviation: mailerContent.abbreviation,
                bodyHeader: mailerContent.body_header,
                bodyDescription: mailerContent.body_description,
                body: mailerContent.body ?? '',
                bodyLastDescription: mailerContent.body_last_description,
                createdAt: mailerContent.createdAt,
                updatedAt: mailerContent.updatedAt,
                deletedAt: mailerContent.deletedAt
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }

    async getById(id: number): Promise<MailerContentInterface> {
        try {
            const mailerContent = await MailerContentSequelize.findByPk(id);
            if (!mailerContent) {
                throw CustomError.notFound('Content not found');
            }
            return {
                id: mailerContent.id,
                name: mailerContent.name,
                abbreviation: mailerContent.abbreviation,
                bodyHeader: mailerContent.body_header,
                bodyDescription: mailerContent.body_description,
                body: mailerContent.body ?? '',
                bodyLastDescription: mailerContent.body_last_description,
                createdAt: mailerContent.createdAt,
                updatedAt: mailerContent.updatedAt,
                deletedAt: mailerContent.deletedAt
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }

    async getByAbbreviation(abbreviation: string): Promise<MailerContentInterface> {
        try {
            const mailerContent = await MailerContentSequelize.findOne({
                where: {abbreviation}
            });
            if (!mailerContent) {
                throw CustomError.notFound('Content not found');
            }
            return {
                id: mailerContent.id,
                name: mailerContent.name,
                abbreviation: mailerContent.abbreviation,
                bodyHeader: mailerContent.body_header,
                bodyDescription: mailerContent.body_description,
                body: mailerContent.body ?? '',
                bodyLastDescription: mailerContent.body_last_description,
                createdAt: mailerContent.createdAt,
                updatedAt: mailerContent.updatedAt,
                deletedAt: mailerContent.deletedAt
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
}