import { ProgramMigrationInteface } from "@/shared/interfaces";

export default abstract class ProgramMigrationDatasource {
    abstract createProgramMigration(abbreviation:string, params?: string): Promise<ProgramMigrationInteface>
}