import ProgramSpecialDatasourceImpl from "../../../../infrastructure/datasource/programSpecial.datasource.impl";
import OrganizationDatasourceImpl from "../../../../infrastructure/datasource/organization.datasource.impl";
import { ProgramSpecial } from "../data/programSpecial.seeder";
import { VersionSpecialDatasourceImpl } from "../../../../infrastructure/datasource/versionSpecial.datasource.impl";

export class ProgramSpecialSeederExec {
    public async up() {
        try {
            const programSeederFbr = ProgramSpecial;
            const funiber = await new OrganizationDatasourceImpl().getInstitutionByModalityAndAbbreviation('virtual', 'fbr', true);
            if (funiber) {
                for (let i = 0; i < programSeederFbr.length; i++) {
                    const element = programSeederFbr[i];
                    const program = await new ProgramSpecialDatasourceImpl().createProgramSpecial(element.program_abbreviation, funiber);
                    for (let j = 0; j < element.versions.length; j++) {
                        const version = element.versions[j];
                        await new VersionSpecialDatasourceImpl().createVersionSpecial(version, program.id);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}