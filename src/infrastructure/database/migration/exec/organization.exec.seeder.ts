import {seederInstition} from '../data/organization.data.seeder';
import InstitutionRegisterDto from '../../../../domain/dtos/internal/organization.dto';
import { CustomError } from '../../../../shared/errors/custom.error';
import OrganizationDatasourceImpl from '../../../datasource/organization.datasource.impl';

export class OrganizationSeederExec {
    public async up() {
        try {
            const institutionSeeder = seederInstition;            
            for (let i = 0; i < institutionSeeder.length; i++) {
                const [error, institutionDto] = InstitutionRegisterDto.create(institutionSeeder[i]);
                
                if (error) throw CustomError.internalSever(error)
                const institution = institutionDto!
                await new OrganizationDatasourceImpl().createInstitution(institution)
            }
        } catch (error) {
            console.log(error)
        }
    }
}