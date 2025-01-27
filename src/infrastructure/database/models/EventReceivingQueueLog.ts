import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { StatusTransactionCatalogSequelize } from "./StatusTransactionCatalog";
import { EventReceivingQueueSequelize } from "./EventReceivingQueue";

interface EventReceivingQueueLogRow {
    id: number;
    event_receiving_queue_id: number;
    status_transaction_catalog_id: number;
    attempts: number | null;
    params: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class EventReceivingQueueLogSequelize extends Model<EventReceivingQueueLogRow, Omit<EventReceivingQueueLogRow, 'id'>> {
    declare id: number;
    declare event_receiving_queue_id: number;
    declare status_transaction_catalog_id: number;
    declare attempts: number;
    declare params: string | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

EventReceivingQueueLogSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    event_receiving_queue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EventReceivingQueueSequelize,
            key: 'id'
        }
    },
    status_transaction_catalog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: StatusTransactionCatalogSequelize,
            key: 'id'
        }
    },
    attempts: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    params: {
        type: DataTypes.JSON,
        allowNull: true
    },
}, {
    sequelize,
    timestamps: true,
    tableName: 'event_receiving_queue_log',
    underscored: true,
    paranoid: true // Habilita `deletedAt` para soft deletes
});
