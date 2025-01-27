import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database/sequelize";

interface MailerContentRow {
    id: number;
    name: string;
    abbreviation: string;
    body_header: string;
    body_description: string;
    body: string | null;
    body_last_description: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class MailerContentSequelize extends Model<MailerContentRow, Omit<MailerContentRow, "id">> {
    declare id: number;
    declare name: string;
    declare abbreviation: string;
    declare body_header: string;
    declare body_description: string;
    declare body: string | null;
    declare body_last_description: string;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date | null;
}

MailerContentSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    abbreviation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body_header: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    body_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    body_last_description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'mailer_content',
    underscored: true,
    paranoid: true
})