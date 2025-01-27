export default class EventReceivingQueueLogDto {
    constructor(
      public id: number,
      public event_receiving_queue_id: number,
      public status_transaction_catalog_id: number,
      public attempts: number,
      public params: string | null,
      public createdAt: Date,
      public updatedAt: Date
    ) {}
  
    static create(object: { [key: string]: any }): [string?, EventReceivingQueueLogDto?] {
      if (!object.id) {
        return ["ID_REQUIRED", undefined];
      }
      if (!object.event_receiving_queue_id) {
        return ["EVENT_RECEIVING_QUEUE_ID_REQUIRED", undefined];
      }
      if (!object.status_transaction_catalog_id) {
        return ["STATUS_TRANSACTION_CATALOG_ID_REQUIRED", undefined];
      }
      if (object.attempts === undefined || object.attempts === null) {
        return ["ATTEMPTS_REQUIRED", undefined];
      }
      if (!object.createdAt) {
        return ["CREATED_AT_REQUIRED", undefined];
      }
  
      return [
        undefined,
        new EventReceivingQueueLogDto(
          object.id,
          object.event_receiving_queue_id,
          object.status_transaction_catalog_id,
          object.attempts,
          object.params || null,
          object.createdAt,
          object.updatedAt || null
        )
      ];
    }
  }
  