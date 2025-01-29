import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { ProgramSpecialSequelize } from "./ProgramSpecial";

interface VersionSpecialRow {
    id: number;
    version: string;
    programSpecialId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class VersionSpecialSequelize extends Model<VersionSpecialRow, Omit<VersionSpecialRow, 'id'>> {
    declare id: number;
    declare version: string;
    declare programSpecialId: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

VersionSpecialSequelize.init({
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
    programSpecialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProgramSpecialSequelize,
            key: 'id',
        }
    }
}, {
    sequelize,
    tableName: 'version_special',
    timestamps: true,
    paranoid: true,
    underscored: true
});