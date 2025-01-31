import { OrganizationInterface, ProgramMigrationInteface } from "../../shared/interfaces";
import ProgramMigrationDatasource from "../../domain/datasource/programMigration.datasource";
import { CustomError } from "../../shared/errors/custom.error";
import { ProgramMigrationSequelize } from "../database/models/ProgramMigration";
import VersionMigrationImpl from "./versionMigration.datasource.impl";

export default class ProgramMigrationDatasourceImpl implements ProgramMigrationDatasource {
    async createProgramMigration(abbreviation: string, organization:OrganizationInterface, params?: string): Promise<ProgramMigrationInteface> {
        try {
            const [program,created] = await ProgramMigrationSequelize.findOrCreate({
                where: {
                    abbreviation: abbreviation
                },
                defaults: {
                    abbreviation: abbreviation,
                    params: params,
                    uuid: crypto.randomUUID(),
                    organizationId: organization.id
                }
            });
            if (!created) {
                program.versions = await new VersionMigrationImpl().getVersionsByProgramId(program.id);
            }
            return {
                abbreviation: program.abbreviation,
                params: program.params,
                uuid: program.uuid,
                id: program.id,
                versions: program.versions
            }
        }catch (error) {
            console.log(error);
            
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async getMigratedProgram(abbreviation: string): Promise<ProgramMigrationInteface | null> {
        try {
            const program = await ProgramMigrationSequelize.findOne({
                where: {
                    abbreviation: abbreviation
                }
            })
            if (!program) {
                return null;
            }
            program.versions = await new VersionMigrationImpl().getVersionsByProgramId(program.id);

            return {
                abbreviation: program.abbreviation,
                params: program.params,
                uuid: program.uuid,
                id: program.id,
                versions: program.versions
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async programIsMigrated(abbreviation: string, version: string): Promise<boolean> {
        try {
            // validamos el programa sea migrado sino ignoramos el proceso
            const programMigrated = await new ProgramMigrationDatasourceImpl().getMigratedProgram(abbreviation);
            //todo fix this
            if(!programMigrated) return false;
            
            //una vez se encuentra que el programa esta migrado se revisa si la version esta migrada
            const versionMigrated = programMigrated.versions.find((versionItem) => versionItem.version === version)
            if(!versionMigrated) return false;
            return true;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
}