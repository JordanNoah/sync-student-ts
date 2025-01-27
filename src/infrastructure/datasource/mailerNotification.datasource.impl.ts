import { MailerNotificationDatasource } from '../../domain/datasource/mailerNotification.datasource';
import { CustomError } from '../../shared/errors/custom.error';
import { MailerNotificationSequelize } from '../../infrastructure/database/models/MailerNotification';
import { MailerNotificationDto } from '../../../src/domain/dtos/mailer/mailerNotification.dto';
import { MailerNotificationInterface } from '../../../src/shared/interfaces';

export class MailerNotificationDatasourceImpl implements MailerNotificationDatasource {
  async register (mailerNotificationDto: MailerNotificationDto): Promise<MailerNotificationInterface> {
    try {
        const [mailerNotification] = await MailerNotificationSequelize.findOrCreate({
            where: {
                abbreviation: mailerNotificationDto.abbreviation
            },
            defaults: {
                name: mailerNotificationDto.name,
                abbreviation: mailerNotificationDto.abbreviation,
                subject: mailerNotificationDto.subject,
                to: {
                    beta: mailerNotificationDto.to.beta,
                    production: mailerNotificationDto.to.production,
                    development: mailerNotificationDto.to.beta ?? []
                },
                cc: {
                    beta: mailerNotificationDto.cc?.beta ?? [],
                    production: mailerNotificationDto.cc?.production ?? [],
                    development: mailerNotificationDto.cc?.beta ?? []

                },
                cco: {
                    beta: mailerNotificationDto.cco?.beta ?? [],
                    production: mailerNotificationDto.cco?.production ?? [],
                    development: mailerNotificationDto.cco?.beta ?? []
                }
            }
        })

        return {
            id: mailerNotification.id,
            name: mailerNotification.name,
            abbreviation: mailerNotification.abbreviation,
            subject: mailerNotification.subject,
            to: {
                beta: mailerNotification.to.beta,
                production: mailerNotification.to.production,
                development: mailerNotification.to.beta ?? []
            },
            cc: {
                beta: mailerNotification.cc.beta,
                production: mailerNotification.cc.production,
                development: mailerNotification.cc.beta ?? []
            },
            cco: {
                beta: mailerNotification.cco.beta,
                production: mailerNotification.cco.production,
                development: mailerNotification.cco.beta ?? []
            },
            createdAt: mailerNotification.createdAt,
            updatedAt: mailerNotification.updatedAt,
            deletedAt: mailerNotification.deletedAt
        }
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        throw CustomError.internalSever();
    }
  }

  async getByAbbreviation (abbreviation: string): Promise<MailerNotificationInterface> {
    try {
        const mailerNotification = await MailerNotificationSequelize.findOne({
            where: {
                abbreviation
            }
        })

        if (!mailerNotification) {
            throw CustomError.notFound('Mailer notification not found');
        }

        return {
            id: mailerNotification.id,
            name: mailerNotification.name,
            abbreviation: mailerNotification.abbreviation,
            subject: mailerNotification.subject,
            to: {
                beta: mailerNotification.to.beta,
                production: mailerNotification.to.production,
                development: mailerNotification.to.beta ?? []
            },
            cc: {
                beta: mailerNotification.cc.beta,
                production: mailerNotification.cc.production,
                development: mailerNotification.cc.beta ?? []
            },
            cco: {
                beta: mailerNotification.cco.beta,
                production: mailerNotification.cco.production,
                development: mailerNotification.cco.beta ?? []
            },
            createdAt: mailerNotification.createdAt,
            updatedAt: mailerNotification.updatedAt,
            deletedAt: mailerNotification.deletedAt
        }
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        throw CustomError.internalSever();
    }
  }
}