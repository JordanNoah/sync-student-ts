import { OrganizationInterface, ProgramMigrationInteface } from "@/shared/interfaces";

export default abstract class ProgramMigrationDatasource {
    abstract createProgramMigration(abbreviation:string, organization:OrganizationInterface, params?: string): Promise<ProgramMigrationInteface>
    abstract getMigratedProgram(abbreviation: string): Promise<ProgramMigrationInteface | null>
}