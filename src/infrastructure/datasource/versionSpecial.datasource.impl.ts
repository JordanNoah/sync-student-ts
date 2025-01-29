import { VersionSpecialInterface } from "../../shared/interfaces";
import VersionSpecialDatasource from "../../domain/datasource/versionSpecial.datasource";
import { CustomError } from "../../shared/errors/custom.error";
import { VersionSpecialSequelize } from "../database/models/VersionSpecial";

export class VersionSpecialDatasourceImpl implements VersionSpecialDatasource {
    async createVersionSpecial(version: string, programSpecialId: number, params?: string): Promise<VersionSpecialInterface> {
        try {
            const [versionSpecial, created] = await VersionSpecialSequelize.findOrCreate({
                where: {
                    version: version,
                    programSpecialId: programSpecialId
                },
                defaults: {
                    programSpecialId: programSpecialId,
                    version: version,
                }
            });
            return {
                version: versionSpecial.version,
                programSpecialId: versionSpecial.programSpecialId,
                id: versionSpecial.id,
                createdAt: versionSpecial.createdAt,
                updatedAt: versionSpecial.updatedAt,
                deletedAt: versionSpecial.deletedAt
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async getVersionsByProgramId(programId: number): Promise<VersionSpecialInterface[]> {
        try {
            const versions = await VersionSpecialSequelize.findAll({
                where: {
                    programSpecialId: programId
                }
            });
            return versions.map(version => {
                return {
                    version: version.version,
                    programSpecialId: version.programSpecialId,
                    id: version.id,
                    createdAt: version.createdAt,
                    updatedAt: version.updatedAt,
                    deletedAt: version.deletedAt
                }
            });
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
}