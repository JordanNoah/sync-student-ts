import { InscriptionEventInterface } from "@/shared/interfaces";
import InscriptionEventDto from "../dtos/internal/inscriptionEvent.dto";

export default abstract class InscriptionEventDatasource {
    abstract createInscriptionEvent(inscriptionEventDto: InscriptionEventDto): Promise<InscriptionEventInterface>;
}