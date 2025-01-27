import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database/sequelize";
import { MailerNotificationSequelize } from "./MailerNotification";
import { InscriptionEventSequelize } from "./InscriptionEvent";

export enum MailerNotificationStatus {
    PENDING = 'pending',
    SENT = 'sent',
    FAILED = 'failed'
}

interface MailerHistoryRow {
    id: number;
    uuid: string;
    mailer_notification_id: number;
    subject: string;
    to: string;
    cc: string;
    cco: string;
    body: string | null;
    status: MailerNotificationStatus;
    attempts: number;
    sentAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class MailerHistorySequelize extends Model<MailerHistoryRow, Omit<MailerHistoryRow, 'id'>> {
    declare id: number;
    declare uuid: string;
    declare mailer_notification_id: number;
    declare subject: string;
    declare to: string;
    declare cc: string;
    declare cco: string;
    declare body: string | null;
    declare status: MailerNotificationStatus;
    declare attempts: number;
    declare sentAt: Date | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

MailerHistorySequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    mailer_notification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MailerNotificationSequelize,
            key: 'id'
        }
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    to: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    cc: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cco: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM,
        values: Object.values(MailerNotificationStatus),
        allowNull: false,
        defaultValue: MailerNotificationStatus.PENDING
    },
    attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sentAt: {
        type: DataTypes.DATE,
        allowNull: true
    },

}, {
    sequelize,
    timestamps: true,
    tableName: 'mailer_history',
    underscored: true,
    paranoid: true,
    indexes: [
        {
            name: 'mailer_notification_history_mailer_notification_id_index',
            fields: ['mailer_notification_id']
        },
        {
            name: 'mailer_notification_history_student_id_index',
            fields: ['student_id']
        }
        
    ]
});