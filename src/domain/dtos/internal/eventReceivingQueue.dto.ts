export default class EventReceivingQueueDto {
  constructor(
    public id: number,
    public uuid: string,
    public received_data: string,
    public processed_at: Date | null,
    public attempts: number,
    public event_name: string,
    public status_transaction_catalog_id: number,
    public scheduled_at: Date | null,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null,
    public is_processed_batch: boolean
  ) {}

  static create(object: { [key: string]: any }): [string?, EventReceivingQueueDto?] {
    if (!object.id) {
      return ["ID_REQUIRED", undefined];
    }
    if (!object.uuid) {
      return ["UUID_REQUIRED", undefined];
    }
    if (!object.received_data) {
      return ["RECEIVED_DATA_REQUIRED", undefined];
    }
    if (object.processed_at === undefined) {
      return ["PROCESSED_AT_REQUIRED", undefined];
    }
    if (object.attempts === undefined) {
      return ["ATTEMPTS_REQUIRED", undefined];
    }
    if (!object.event_name) {
      return ["EVENT_NAME_REQUIRED", undefined];
    }
    if (object.status_transaction_catalog_id === undefined) {
      return ["STATUS_TRANSACTION_CATALOG_ID_REQUIRED", undefined];
    }
    if (object.scheduled_at === undefined) {
      return ["SCHEDULED_AT_REQUIRED", undefined];
    }
    if (!object.createAt) {
      return ["CREATED_AT_REQUIRED", undefined];
    }
    if (!object.updatedAt) {
      return ["UPDATED_AT_REQUIRED", undefined];
    }
    if (object.deletedAt === undefined) {
      return ["DELETED_AT_REQUIRED", undefined];
    }
    if (object.is_processed_batch === undefined) {
      return ["IS_PROCESSED_BATCH_REQUIRED", undefined];
    }

    return [
      undefined,
      new EventReceivingQueueDto(
        object.id,
        object.uuid,
        object.received_data,
        object.processed_at,
        object.attempts,
        object.event_name,
        object.status_transaction_catalog_id,
        object.scheduled_at,
        object.createAt,
        object.updatedAt,
        object.deletedAt,
        object.is_processed_batch
      ),
    ];
  }
}
