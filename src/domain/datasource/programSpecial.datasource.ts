import { OrganizationInterface, ProgramSpecialInterface } from "../../shared/interfaces";

export default abstract class ProgramSpecialDatasource {
    abstract createProgramSpecial(abbreviation:string, organization:OrganizationInterface, params?: string): Promise<ProgramSpecialInterface>
    abstract getMigratedProgram(abbreviation: string): Promise<ProgramSpecialInterface | null>
}