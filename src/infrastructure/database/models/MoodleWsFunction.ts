import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";

interface MoodleWsFunctionRow {
    id: number;
    function: string;
    abbreviation: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class MoodleWsFunctionSequelize extends Model<MoodleWsFunctionRow, Omit<MoodleWsFunctionRow, 'id'>> {
    declare id: number;
    declare function: string;
    declare abbreviation: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

MoodleWsFunctionSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    function: {
        type: DataTypes.STRING,
        allowNull: false
    },
    abbreviation: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    timestamps: true,
    tableName: 'moodle_ws_functions',
    underscored: true,
    paranoid: true
});
