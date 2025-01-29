import { VersionMigrationInterface } from "../../shared/interfaces";
import VersionMigrationDatasource from "../../domain/datasource/versionMigration.datasource";
import { CustomError } from "../../shared/errors/custom.error";
import { VersionMigrationSequelize } from "../database/models/VersionMigrated";

export default class VersionMigrationImpl implements VersionMigrationDatasource {
    async createVersionMigration(abbreviation: string, programMigrationId:number, params?: string): Promise<VersionMigrationInterface> {
        try {
            const [version, created] = await VersionMigrationSequelize.findOrCreate({
                where: {
                    version: abbreviation,
                    programMigrationId:programMigrationId
                },
                defaults: {
                    programMigrationId: programMigrationId,
                    version: abbreviation,
                }
            });
            return {
                version: version.version,
                programMigrationId: version.programMigrationId,
                id: version.id,
                createdAt: version.createdAt,
                updatedAt: version.updatedAt,
                deletedAt: version.deletedAt
            }
        } catch (error) {
            console.log(error);
            
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async getVersionsByProgramId(programId: number): Promise<VersionMigrationInterface[]> {
        try {
            const versions = await VersionMigrationSequelize.findAll({
                where: {
                    programMigrationId: programId
                }
            });
            return versions.map(version => {
                return {
                    version: version.version,
                    programMigrationId: version.programMigrationId,
                    id: version.id,
                    createdAt: version.createdAt,
                    updatedAt: version.updatedAt,
                    deletedAt: version.deletedAt
                }
            });
        } catch(error){
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
}