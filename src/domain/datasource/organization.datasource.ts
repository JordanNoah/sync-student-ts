import { OrganizationInterface } from "@/shared/interfaces";
import OrganizationDto from "../dtos/internal/organization.dto";
import SignUpDto from "../dtos/signUp/signUp.dto";
import InscriptionDto from "../dtos/signUp/inscription.dto";

export default abstract class OrganizationDatasource {
    abstract createInstitution(organizationDto: OrganizationDto): Promise<OrganizationInterface>
    abstract getInstitutionByModalityAndAbbreviation(modality: string, abbreviation:string, available:boolean): Promise<OrganizationInterface | null>
    abstract getOrganizationsByImportance(abbreviation:string[],modality:string, orderImportance?:boolean): Promise<OrganizationInterface[]>
    abstract getActiveById(id: number): Promise<OrganizationInterface | null>
    abstract getSignUpOrganization(inscriptionDto: InscriptionDto): Promise<OrganizationInterface>
}