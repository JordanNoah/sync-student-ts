import EventReceivingQueueDatasource from "../../domain/datasource/event_receiving_queue.datasource";
import EventReceivingQueueDto from "../../domain/dtos/internal/event_receiving_queue.dto";
import { CustomError } from "../../shared/errors/custom.error";
import { EventReceivingQueueInterface } from "../../shared/interfaces";
import { EventReceivingQueueSequelize } from "../database/models/EventReceivingQueue";

export default class EventReceivingQueueDatasourceImpl extends EventReceivingQueueDatasource {
  async createEventReceivingQueue(
    dto: EventReceivingQueueDto
  ): Promise<EventReceivingQueueInterface> {
    try {
      const [eventQueue] = await EventReceivingQueueSequelize.findOrCreate({
        where: {
          uuid: dto.uuid
        },
        defaults: {
          uuid: dto.uuid,
          received_data: dto.received_data,
          processed_at: dto.processed_at,
          attempts: dto.attempts,
          event_name: dto.event_name,
          status_transaction_catalog_id: dto.status_transaction_catalog_id,
          scheduled_at: dto.scheduled_at,
          createdAt: dto.createdAt,
          updatedAt: dto.updatedAt,
          deletedAt: dto.deletedAt,
          is_processed_batch: dto.is_processed_batch
        }
      });

      return {
        id: eventQueue.id,
        uuid: eventQueue.uuid,
        received_data: eventQueue.received_data,
        processed_at: eventQueue.processed_at,
        attempts: eventQueue.attempts,
        event_name: eventQueue.event_name,
        status_transaction_catalog_id: eventQueue.status_transaction_catalog_id,
        scheduled_at: eventQueue.scheduled_at,
        createdAt: eventQueue.createdAt,
        updatedAt: eventQueue.updatedAt,
        deletedAt: eventQueue.deletedAt,
        is_processed_batch: eventQueue.is_processed_batch
      };
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalSever();
    }
  }
}
