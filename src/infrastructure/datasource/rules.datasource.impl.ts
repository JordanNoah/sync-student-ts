import RulesDatasource from "@/domain/datasource/rules.datasource";
import SignUpDto from "@/domain/dtos/signUp/signUp.dto";
import { CustomError } from "@/shared/errors/custom.error";
import { InscriptionEventInterface, OrganizationInterface } from "@/shared/interfaces";
import OrganizationDatasourceImpl from "./organization.datasource.impl";
import InscriptionDto from "@/domain/dtos/signUp/inscription.dto";

export default class RulesDatasourceImpl implements RulesDatasource {
    async getOrganizationSignUpRules(inscription: InscriptionDto): Promise<OrganizationInterface | null> {
        try {
            // llamamos a la base de datos para obtener las universidades por importancia
            const organizationsDb = await new OrganizationDatasourceImpl().getOrganizationsByImportance(inscription.degrees.map(degree => degree.abbreviation), inscription.modality, true);
            console.log(organizationsDb);
            
            return null
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
}