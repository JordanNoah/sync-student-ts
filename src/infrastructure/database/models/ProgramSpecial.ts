import { VersionMigrationInterface, VersionSpecialInterface } from "../../../shared/interfaces";
import { sequelize } from "../sequelize";
import { DataTypes, Model } from "sequelize";
import { OrganizationSequelize } from "./Organization";

interface ProgramSpecialRow {
    id: number;
    uuid: string;
    abbreviation: string;
    params: string | null;
    organizationId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class ProgramSpecialSequelize extends Model<ProgramSpecialRow, Omit<ProgramSpecialRow, 'id'>> {
    declare id: number;
    declare uuid: string;
    declare abbreviation: string;
    declare params: string | null;
    declare organizationId: number;
    declare versions: VersionSpecialInterface[];
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

ProgramSpecialSequelize.init({
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
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'program_special',
    timestamps: true,
    paranoid: true,
    underscored: true
});