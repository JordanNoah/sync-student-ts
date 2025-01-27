import { InscriptionEventInterface, OrganizationInterface } from "@/shared/interfaces";
import SignUpDto from "../dtos/signUp/signUp.dto";
import InscriptionDto from "../dtos/signUp/inscription.dto";

export default abstract class RulesDatasource {
    abstract getOrganizationSignUpRules(inscription: InscriptionDto): Promise<OrganizationInterface | null>;
}