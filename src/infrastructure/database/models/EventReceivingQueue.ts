import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { StatusTransactionCatalogSequelize } from "./StatusTransactionCatalog";

interface EventReceivingQueueRow {
    id: number;
    uuid: string;
    received_data: string;
    processed_at: Date | null;
    attempts: number;
    event_name: string;
    status_transaction_catalog_id: number;
    scheduled_at: Date | null;
    is_processed_batch: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class EventReceivingQueueSequelize extends Model<EventReceivingQueueRow, Omit<EventReceivingQueueRow, 'id'>> {
    declare id: number;
    declare uuid: string;
    declare received_data: string;
    declare processed_at: Date | null;
    declare attempts: number;
    declare event_name: string;
    declare status_transaction_catalog_id: number;
    declare scheduled_at: Date | null;
    declare is_processed_batch: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

EventReceivingQueueSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    uuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    received_data: {
        type: DataTypes.JSON,
        allowNull: false
    },
    processed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    attempts: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    event_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status_transaction_catalog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: StatusTransactionCatalogSequelize,
            key: 'id'
        }
    },
    scheduled_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_processed_batch: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'event_receiving_queue',
    underscored: true,
    paranoid: true, // Habilita soft deletes con `deletedAt`
    indexes: [
        {
            name: 'event_receiving_queue_processed_at_index',
            fields: ['processed_at']
        },
        {
            name: 'event_receiving_queue_status_transaction_catalog_id_index',
            fields: ['status_transaction_catalog_id']
        }
    ]
});
