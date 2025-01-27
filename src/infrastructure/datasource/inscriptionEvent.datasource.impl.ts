import InscriptionEventDatasource from "../../domain/datasource/inscription_event.dto";
import InscriptionEventDto from "../../domain/dtos/internal/inscription_event.dto";
import { CustomError } from "../../shared/errors/custom.error";
import { InscriptionEventInterface } from "../../shared/interfaces";
import { InscriptionEventSequelize } from "../database/models/InscriptionEvent";

export default class InscriptionEventDatasourceImpl extends InscriptionEventDatasource {
    async createInscriptionEvent(inscriptionEventDto: InscriptionEventDto): Promise<InscriptionEventInterface> {
        try {
            const [inscriptionEvent, created] = await InscriptionEventSequelize.findOrCreate({
                where: {
                  id: inscriptionEventDto.id
                },
                defaults: {
                    uuid_external_inscription: inscriptionEventDto.uuid_external_inscription,
                    data: inscriptionEventDto.data,
                    is_forced: inscriptionEventDto.is_forced,
                    processed_at: inscriptionEventDto.processed_at,
                    status_transaction_catalog_id: inscriptionEventDto.status_transaction_catalog_id,
                    event_receiving_queue_id: inscriptionEventDto.event_receiving_queue_id,
                    scheduled_at: inscriptionEventDto.scheduled_at,
                    id_number_student: inscriptionEventDto.id_number_student,
                    createdAt: inscriptionEventDto.createdAt,
                    updatedAt: inscriptionEventDto.updatedAt,
                    deletedAt: inscriptionEventDto.deletedAt
                    }
              });
              return {
                    id: inscriptionEvent.id,
                    uuid_external_inscription: inscriptionEvent.uuid_external_inscription,
                    data: inscriptionEvent.data,
                    is_forced: inscriptionEvent.is_forced,
                    processed_at: inscriptionEvent.processed_at,
                    status_transaction_catalog_id: inscriptionEvent.status_transaction_catalog_id,
                    event_receiving_queue_id: inscriptionEvent.event_receiving_queue_id,
                    scheduled_at: inscriptionEvent.scheduled_at,
                    id_number_student: inscriptionEvent.id_number_student,
                    createdAt: inscriptionEvent.createdAt,
                    updatedAt: inscriptionEvent.updatedAt,
                    deletedAt: inscriptionEvent.deletedAt,
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