import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { EventReceivingQueueSequelize } from "./EventReceivingQueue";
import { EventReceivingQueueLogSequelize } from "./EventReceivingQueueLog";
import { OrganizationSequelize } from "./Organization";

interface GroupDeletedNotificationRow {
    id: number;
    id_number: string | null;
    name: string | null;
    data_groups_campus: string | null;
    is_sent: boolean | null;
    event_receiving_queue_id: number;
    event_receiving_queue_log_id: number;
    organization_id: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class GroupDeletedNotificationSequelize extends Model<GroupDeletedNotificationRow, Omit<GroupDeletedNotificationRow, 'id'>> {
    declare id: number;
    declare id_number: string | null;
    declare name: string | null;
    declare data_groups_campus: string | null;
    declare is_sent: boolean | null;
    declare event_receiving_queue_id: number;
    declare event_receiving_queue_log_id: number;
    declare organization_id: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

GroupDeletedNotificationSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    id_number: {
        type: DataTypes.UUID,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    data_groups_campus: {
        type: DataTypes.JSON,
        allowNull: true
    },
    is_sent: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    event_receiving_queue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EventReceivingQueueSequelize,
            key: 'id'
        }
    },
    event_receiving_queue_log_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EventReceivingQueueLogSequelize,
            key: 'id'
        }
    },
    organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: OrganizationSequelize,
            key: 'id'
        }
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'group_deleted_notification',
    underscored: true,
    paranoid: true, // Habilita soft deletes con `deletedAt`
    indexes: [
        {
            name: 'group_deleted_notification_is_sent_index',
            fields: ['is_sent']
        },
        {
            name: 'group_deleted_notification_id_number_index',
            fields: ['id_number']
        }
    ]
});
