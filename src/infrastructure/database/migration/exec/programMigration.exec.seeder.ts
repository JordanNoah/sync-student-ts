import {migrationFbr,migrationUnib} from "../data/programMigration.seeder"
import ProgramMigrationDatasourceImpl from "../../../../infrastructure/datasource/programMigration.datasource.impl";
import OrganizationDatasourceImpl from "../../../../infrastructure/datasource/organization.datasource.impl";
import VersionMigrationImpl from "../../../../infrastructure/datasource/versionMigration.datasource.impl";
export class ProgramMigrationSeederExec {
    public async up(){
        try {
            const programSeederFbr = migrationFbr;
            const funiber = await new OrganizationDatasourceImpl().getInstitutionByModalityAndAbbreviation('virtual','fbr',true)
            const unib = await new OrganizationDatasourceImpl().getInstitutionByModalityAndAbbreviation('virtual','unib',true)
            if(funiber){
                for (let i = 0; i < programSeederFbr.length; i++) {
                    const element = programSeederFbr[i];
                    const program = await new ProgramMigrationDatasourceImpl().createProgramMigration(element.program_abbreviation, funiber);
                    for (let j = 0; j < element.versions.length; j++) {
                        const version = element.versions[j];
                        await new VersionMigrationImpl().createVersionMigration(version,program.id);
                    }
                }
            }
            if(unib){
                for (let i = 0; i < migrationUnib.length; i++) {
                    const element = migrationUnib[i];
                    const program = await new ProgramMigrationDatasourceImpl().createProgramMigration(element.program_abbreviation,unib);
                    for (let j = 0; j < element.versions.length; j++) {
                        const version = element.versions[j];
                        await new VersionMigrationImpl().createVersionMigration(version,program.id);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}