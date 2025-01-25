import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";

interface OrganizationRow {
    id: number;
    name: string;
    abbreviation: string;
    degree_abbreviation: string;
    origin: string | null;
    rest_path: string | null;
    token: string | null;
    modality: string | null;
    additional_data: string | null;
    translations: string | null;
    parent: number | null;
    importance: number | null;
    available: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class OrganizationSequelize extends Model<OrganizationRow, Omit<OrganizationRow, 'id'>> {
    declare id: number;
    declare name: string;
    declare abbreviation: string;
    declare degree_abbreviation: string;
    declare origin: string | null;
    declare rest_path: string | null;
    declare token: string | null;
    declare modality: string | null;
    declare additional_data: string | null;
    declare translations: string | null;
    declare parent: number | null;
    declare importance: number | null;
    declare available: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

OrganizationSequelize.init({
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
    degree_abbreviation: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rest_path: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    modality: {
        type: DataTypes.ENUM('presential', 'virtual', 'semi_presential'),
        allowNull: true
    },
    additional_data: {
        type: DataTypes.JSON,
        allowNull: true
    },
    translations: {
        type: DataTypes.JSON,
        allowNull: true
    },
    parent: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: OrganizationSequelize,
            key: 'id'
        }
    },
    importance: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'organization',
    underscored: true,
    paranoid: true, // Habilita `deletedAt` para soft deletes
    indexes: [
        {
            name: 'organization_name_index',
            fields: ['name']
        },
        {
            name: 'organization_abbreviation_modality_index',
            fields: ['abbreviation', 'modality']
        }
    ]
});
