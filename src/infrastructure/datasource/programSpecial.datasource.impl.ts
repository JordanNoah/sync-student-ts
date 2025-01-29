import { OrganizationInterface, ProgramSpecialInterface } from "../../shared/interfaces";
import ProgramSpecialDatasource from "../../domain/datasource/programSpecial.datasource";
import { CustomError } from "../../shared/errors/custom.error";
import { ProgramSpecialSequelize } from "../database/models/ProgramSpecial";
import { VersionSpecialDatasourceImpl } from "./versionSpecial.datasource.impl";

export default class ProgramSpecialDatasourceImpl implements ProgramSpecialDatasource {
    async createProgramSpecial(abbreviation: string, organization: OrganizationInterface, params?: string): Promise<ProgramSpecialInterface> {
        try {
            const [program, created] = await ProgramSpecialSequelize.findOrCreate({
                where: {
                    abbreviation: abbreviation
                },
                defaults: {
                    abbreviation: abbreviation,
                    params: params,
                    uuid: crypto.randomUUID(),
                    organizationId: organization.id
                }
            })
            if (!created) {
                program.versions = await new VersionSpecialDatasourceImpl().getVersionsByProgramId(program.id);
            }
            return {
                abbreviation: program.abbreviation,
                params: program.params,
                uuid: program.uuid,
                id: program.id,
                versions: program.versions
            }
        } catch (error) {
            console.log(error);
            
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async getMigratedProgram(abbreviation: string): Promise<ProgramSpecialInterface | null> {
        try {
            const program = await ProgramSpecialSequelize.findOne({
                where: {
                    abbreviation: abbreviation
                }
            })
            if (!program) {
                return null;
            }
            program.versions = await new VersionSpecialDatasourceImpl().getVersionsByProgramId(program.id);

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
}