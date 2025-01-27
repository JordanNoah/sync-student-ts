import { EventReceivingQueueInterface } from "@/shared/interfaces";
import EventReceivingQueueDto from "../dtos/internal/eventReceivingQueue.dto";

export default abstract class EventReceivingQueueDatasource {
    abstract createEventReceivingQueue(eventReceivingQueueDto: EventReceivingQueueDto): Promise<EventReceivingQueueInterface>;
}