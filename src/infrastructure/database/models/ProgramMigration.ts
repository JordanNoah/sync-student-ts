import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { VersionMigrationInterface } from "../../../shared/interfaces";
import { OrganizationSequelize } from "./Organization";

interface ProgramMigrationRow {
    id: number;
    uuid: string;
    abbreviation: string;
    params: string | null;
    organizationId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class ProgramMigrationSequelize extends Model<ProgramMigrationRow, Omit<ProgramMigrationRow, 'id'>> {
    declare id: number;
    declare uuid: string;
    declare abbreviation: string;
    declare params: string | null;
    declare organizationId: number;
    declare versions: VersionMigrationInterface[];
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

ProgramMigrationSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    abbreviation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    params: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    organizationId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: OrganizationSequelize,
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
    tableName: 'program_migration',
    timestamps: true,
    paranoid: true,
    underscored: true
})