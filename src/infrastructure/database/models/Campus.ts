import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";

interface CampusRow {
    id: number;
    uuid: string;
    name: string;
    abbreviation: string;
    modality: string;
    domain: string;
    website: string;
    environment: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class CampusSequelize extends Model<CampusRow, Omit<CampusRow, 'id'>> {
    declare id: number;
    declare uuid: string;
    declare name: string;
    declare abbreviation: string;
    declare modality: string;
    declare domain: string;
    declare website: string;
    declare environment: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

CampusSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false
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
    modality: {
        type: DataTypes.STRING,
        allowNull: false
    },
    domain: {
        type: DataTypes.STRING,
        allowNull: false
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false
    },
    environment: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'campus',
    underscored: true
});
