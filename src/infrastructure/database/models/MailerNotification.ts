import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database/sequelize";
import { Environment } from "../../../shared/types";

interface MailerNotificationRow {
    id: number;
    name: string;
    abbreviation: string;
    subject: string;
    to: { [key in Environment]: string[] };
    cc: { [key in Environment]: string[] };
    cco: { [key in Environment]: string[] };
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class MailerNotificationSequelize extends Model<MailerNotificationRow, Omit<MailerNotificationRow, 'id'>> {
    declare id: number;
    declare name: string;
    declare abbreviation: string;
    declare subject: string;
    declare to: { [key in Environment]: string[] };
    declare cc: { [key in Environment]: string[] };
    declare cco: { [key in Environment]: string[] };
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

MailerNotificationSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    abbreviation: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    to: {
        type: DataTypes.JSON,
        allowNull: false
    },
    cc: {
        type: DataTypes.JSON,
        allowNull: true
    },
    cco: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'mailer_notification',
    underscored: true,
    paranoid: true
});