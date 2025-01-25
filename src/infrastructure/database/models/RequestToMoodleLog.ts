import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { MoodleWsFunctionSequelize } from "./MoodleWsFunction";
import { EventReceivingQueueSequelize } from "./EventReceivingQueue";
import { OrganizationSequelize } from "./Organization";
import { EventReceivingQueueLogSequelize } from "./EventReceivingQueueLog";

interface RequestToMoodleLogRow {
    id: number;
    payload: string | null;
    processed: boolean;
    response_detail: string;
    moodle_ws_function_id: number;
    event_receiving_queue_id: number;
    organization_id: number;
    event_receiving_queue_log_id: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class RequestToMoodleLogSequelize extends Model<RequestToMoodleLogRow, Omit<RequestToMoodleLogRow, 'id'>> {
    declare id: number;
    declare payload: string | null;
    declare processed: boolean;
    declare response_detail: string;
    declare moodle_ws_function_id: number;
    declare event_receiving_queue_id: number;
    declare organization_id: number;
    declare event_receiving_queue_log_id: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

RequestToMoodleLogSequelize.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    payload: {
        type: DataTypes.JSON,
        allowNull: true
    },
    processed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    response_detail: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    moodle_ws_function_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MoodleWsFunctionSequelize,
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
    organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: OrganizationSequelize,
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
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'request_to_moodle_log',
    underscored: true,
    paranoid: true, // Habilita soft deletes con `deletedAt`
    indexes: [
        {
            name: 'request_to_moodle_log_moodle_ws_function_id_index',
            fields: ['moodle_ws_function_id']
        },
        {
            name: 'request_to_moodle_log_organization_id_index',
            fields: ['organization_id']
        },
        {
            name: 'request_to_moodle_log_event_receiving_queue_id_index',
            fields: ['event_receiving_queue_id']
        },
        {
            name: 'request_to_moodle_log_event_receiving_queue_log_id_index',
            fields: ['event_receiving_queue_log_id']
        }
    ]
});
