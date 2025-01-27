import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database/sequelize";
import { MailerTemplateSequelize } from "./MailerTemplate";
import { MailerContentSequelize } from "./MailerContent";
import { MailerNotificationSequelize } from "./MailerNotification";

interface MailerTemplateContentRow {
    id: number;
    mailer_template_id: number;
    mailer_content_id: number;
    mailer_notification_id: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class MailerTemplateContentSequelize extends Model<MailerTemplateContentRow, Omit<MailerTemplateContentRow, 'id'>> {
    declare id: number;
    declare mailer_template_id: number;
    declare mailer_content_id: number;
    declare mailer_notification_id: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

MailerTemplateContentSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    mailer_template_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MailerTemplateSequelize,
            key: 'id'
        }
    },
    mailer_content_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MailerContentSequelize,
            key: 'id'
        }
    },
    mailer_notification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MailerNotificationSequelize,
            key: 'id'
        }
    },
}, {
    sequelize,
    timestamps: true,
    tableName: 'mailer_template_content',
    underscored: true,
    paranoid: true,
    indexes: [
        {
            name: 'mailer_template_content_mailer_template_id_index',
            fields: ['mailer_template_id']
        },
        {
            name: 'mailer_template_content_mailer_content_id_index',
            fields: ['mailer_content_id']
        },
        {
            name: 'mailer_template_content_mailer_notification_id_index',
            fields: ['mailer_notification_id']
        }
    ]
});