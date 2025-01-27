import { OrganizationInterface } from "@/shared/interfaces";
import OrganizationDto from "../dtos/internal/organization.dto";

export default abstract class OrganizationDatasource {
    abstract createInstitution(organizationDto: OrganizationDto): Promise<OrganizationInterface>
    abstract getInstitutionByModalityAndAbbreviation(modality: string, abbreviation:string, available:boolean): Promise<OrganizationInterface | null>
}