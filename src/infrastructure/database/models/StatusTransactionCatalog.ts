import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";

interface StatusTransactionCatalogRow {
    id: number;
    name: string;
    abbreviation: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class StatusTransactionCatalogSequelize extends Model<StatusTransactionCatalogRow, Omit<StatusTransactionCatalogRow, 'id'>> {
    declare id: number;
    declare name: string;
    declare abbreviation: string;
    declare description: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

StatusTransactionCatalogSequelize.init({
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
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'status_transaction_catalog',
    underscored: true
});
