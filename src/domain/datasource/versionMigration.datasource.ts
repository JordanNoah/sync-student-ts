import { VersionMigrationInterface } from "@/shared/interfaces";

export default abstract class VersionMigrationDatasource {
    abstract createVersionMigration(version:string, programMigrationId:number ,params?: string): Promise<VersionMigrationInterface>
    abstract getVersionsByProgramId(programId: number): Promise<VersionMigrationInterface[]>
}