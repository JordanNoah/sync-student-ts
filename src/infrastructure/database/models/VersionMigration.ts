import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { ProgramMigrationSequelize } from "./ProgramMigration";

interface VersionMigrationRow {
    id: number;
    version: string;
    programMigrationId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class VersionMigrationSequelize extends Model<VersionMigrationRow, Omit<VersionMigrationRow, 'id'>> {
    declare id: number;
    declare version: string;
    declare programMigrationId: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

VersionMigrationSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    version: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    programMigrationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProgramMigrationSequelize,
            key: 'id',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'version_migration',
    timestamps: true,
    paranoid: true,
    underscored: true,
    modelName: 'VersionMigration',
    indexes: [
        {
            unique: true,
            fields: ['version'],
        },
    ],
});