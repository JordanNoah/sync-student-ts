import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { StatusTransactionCatalogSequelize } from "./StatusTransactionCatalog";
import { EventReceivingQueueSequelize } from "./EventReceivingQueue";

interface InscriptionEventRow {
    id: number;
    uuid_external_inscription: string | null;
    data: string | null;
    is_forced: boolean; // Nueva columna añadida
    processed_at: Date | null;
    status_transaction_catalog_id: number;
    event_receiving_queue_id: number;
    scheduled_at: Date | null;
    id_number_student: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class InscriptionEventSequelize extends Model<InscriptionEventRow, Omit<InscriptionEventRow, 'id'>> {
    declare id: number;
    declare uuid_external_inscription: string;
    declare data: string;
    declare is_forced: boolean; // Nueva columna añadida
    declare processed_at: Date | null;
    declare status_transaction_catalog_id: number;
    declare event_receiving_queue_id: number;
    declare scheduled_at: Date | null;
    declare id_number_student: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

InscriptionEventSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    uuid_external_inscription: {
        type: DataTypes.UUID,
        allowNull: true
    },
    data: {
        type: DataTypes.JSON,
        allowNull: true
    },
    is_forced: { // Nueva columna añadida
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    processed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status_transaction_catalog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: StatusTransactionCatalogSequelize,
            key: 'id'
        }
    },
    event_receiving_queue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EventReceivingQueueSequelize,
            key: 'id'
        }
    },
    scheduled_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    id_number_student: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'inscription_event',
    underscored: true,
    paranoid: true,
    indexes: [
        {
            name: 'inscription_event_uuid_external_inscription_index',
            fields: ['uuid_external_inscription']
        },
        {
            name: 'inscription_event_scheduled_at_index',
            fields: ['scheduled_at']
        },
        {
            name: 'inscription_event_id_number_student_index',
            fields: ['id_number_student']
        }
    ]
});
