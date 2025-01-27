import { EventReceivingQueueLogInterface } from "@/shared/interfaces";
import EventReceivingQueueLogDto from "../dtos/internal/eventReceivingQueueLog.dto";

export default abstract class EventReceivingQueueLogDatasource {
    abstract createEventReceivingQueueLog(eventReceivingQueueLogDto: EventReceivingQueueLogDto): Promise<EventReceivingQueueLogInterface>;
}