import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";

interface AddresseeMailRow {
    id: number;
    reason: string;
    email: string;
    params: string | null;
    activate: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class AddresseeMailSequelize extends Model<AddresseeMailRow, Omit<AddresseeMailRow, 'id'>> {
    declare id: number;
    declare reason: string;
    declare email: string;
    declare params: string | null;
    declare activate: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

AddresseeMailSequelize.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    params: {
        type: DataTypes.JSON,
        allowNull: true
    },
    activate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'addressee_mail',
    underscored: true,
    paranoid: true // Habilita soft deletes con `deletedAt`
});
