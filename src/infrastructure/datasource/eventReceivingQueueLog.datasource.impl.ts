import EventReceivingQueueLogDatasource from "../../domain/datasource/event_receiving_queue_log.datasource";
import EventReceivingQueueLogDto from "../../domain/dtos/internal/eventReceivingQueueLog.dto";
import { EventReceivingQueueLogInterface } from "../../shared/interfaces";
import { EventReceivingQueueLogSequelize } from "../database/models/EventReceivingQueueLog";
import { CustomError } from "../../shared/errors/custom.error";

export default class EventReceivingQueueLogDatasourceImpl extends EventReceivingQueueLogDatasource {
  async createEventReceivingQueueLog(
    dto: EventReceivingQueueLogDto
  ): Promise<EventReceivingQueueLogInterface> {
    try {
      const [log] = await EventReceivingQueueLogSequelize.findOrCreate({
        where: {
          id: dto.id
        },
        defaults: {
          event_receiving_queue_id: dto.event_receiving_queue_id,
          status_transaction_catalog_id: dto.status_transaction_catalog_id,
          attempts: dto.attempts,
          params: dto.params,
          createdAt: dto.createdAt,
          updatedAt: dto.updatedAt
        }
      });

      return {
        id: log.id,
        event_receiving_queue_id: log.event_receiving_queue_id,
        status_transaction_catalog_id: log.status_transaction_catalog_id,
        attempts: log.attempts,
        params: log.params,
        createdAt: log.createdAt,
        updatedAt: log.updatedAt
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
