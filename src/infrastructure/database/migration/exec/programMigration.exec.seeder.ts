import { CustomError } from "@/shared/errors/custom.error";
import {migrationFbr,migrationUnib} from "../data/programMigration.seeder"
import ProgramMigrationDatasourceImpl from "../../../../infrastructure/datasource/programMigration.datasource.impl";
export class ProgramMigrationSeederExec {
    public async up(){
        try {
            const programSeederFbr = migrationFbr;
            for (let i = 0; i < programSeederFbr.length; i++) {
                const element = programSeederFbr[i];
                await new ProgramMigrationDatasourceImpl().createProgramMigration(element.program_abbreviation);
            }
            for (let i = 0; i < migrationUnib.length; i++) {
                const element = migrationUnib[i];
                await new ProgramMigrationDatasourceImpl().createProgramMigration(element.program_abbreviation);
            }
        } catch (error) {
            console.log(error);
        }
    }
}