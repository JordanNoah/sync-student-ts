export default class InscriptionEventDto {
    constructor(
      public id: number,
      public uuid_external_inscription: string,
      public data: string,
      public is_forced: boolean,
      public processed_at: Date | null,
      public status_transaction_catalog_id: number,
      public event_receiving_queue_id: number,
      public scheduled_at: Date | null,
      public id_number_student: string,
      public createdAt: Date,
      public updatedAt: Date, 
      public deletedAt: Date | null,
    ) {}
  
    static create(object: { [key: string]: any }): [string?, InscriptionEventDto?] {
      if (!object.id) {
        return ["ID_REQUIRED", undefined];
      }
      if (!object.uuid_external_inscription) {
        return ["UUID_EXTERNAL_INSCRIPTION_REQUIRED"];
      }
      if (!object.data) {
        return ["DATA_REQUIRED", undefined];
      }
      if (object.is_forced === undefined || object.is_forced === null) {
        return ["IS_FORCED_REQUIRED", undefined];
      }
      if (!object.status_transaction_catalog_id) {
        return ["STATUS_TRANSACTION_CATALOG_ID_REQUIRED", undefined];
      }
      if (!object.event_receiving_queue_id) {
        return ["EVENT_RECEIVING_QUEUE_ID_REQUIRED", undefined];
      }
      if (!object.id__number_student) {
        return ["NUMBER_STUDENT_REQUIRED", undefined];
      }
      if (!object.createdAt) {
        return ["CREATED_AT_REQUIRED", undefined];
      }
  
      return [
        undefined,
        new InscriptionEventDto(
          object.id,
          object.uuid_external_inscription,
          object.data,
          object.is_forced,
          object.processed_at || null,
          object.status_transaction_catalog_id,
          object.event_receiving_queue_id,
          object.scheduled_at || null,
          object.id_number_student,
          object.createdAt,
          object.updatedAt || null,
          object.deletedAt || null
        ),
      ];
    }
  }
  