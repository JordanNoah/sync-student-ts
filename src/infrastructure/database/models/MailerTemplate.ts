import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database/sequelize";

interface MailerTemplateRow {
    id: number;
    name: string;
    abbreviation: string;
    doctype: string;
    head: string;
    header: string;
    body: string;
    footer: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class MailerTemplateSequelize extends Model<MailerTemplateRow, Omit<MailerTemplateRow, 'id'>> {
    declare id: number;
    declare name: string;
    declare abbreviation: string;
    declare doctype: string;
    declare head: string;
    declare header: string;
    declare body: string;
    declare footer: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

MailerTemplateSequelize.init({
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
    abbreviation: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    doctype: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    head: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    header: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    footer: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'mailer_template',
    underscored: true,
    paranoid: true
});