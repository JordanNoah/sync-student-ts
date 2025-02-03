import OrganizationDto from "@/domain/dtos/internal/organization.dto";
import OrganizationDatasource from "../../domain/datasource/organization.datasource";
import { CustomError } from "../../shared/errors/custom.error";
import { OrganizationInterface } from "../../shared/interfaces";
import { OrganizationSequelize } from "../database/models/Organization";
import { FindOptions, Op } from "sequelize";
import SignUpDto from "@/domain/dtos/signUp/signUp.dto";
import InscriptionDto from "@/domain/dtos/signUp/inscription.dto";
import ProgramMigrationDatasourceImpl from "./programMigration.datasource.impl";
import ProgramSpecialDatasourceImpl from "./programSpecial.datasource.impl";

export default class OrganizationDatasourceImpl extends OrganizationDatasource {
    async createInstitution(organizationDto: OrganizationDto): Promise<OrganizationInterface> {
        try {
            const [organization, created] = await OrganizationSequelize.findOrCreate({
                where: {
                    abbreviation: organizationDto.abbreviation,
                    modality: organizationDto.modality
                },
                defaults: {
                    abbreviation: organizationDto.abbreviation,
                    modality: organizationDto.modality ? organizationDto.modality : null,
                    name: organizationDto.name,
                    available: organizationDto.available,
                    degree_abbreviation: organizationDto.degreeAbbreviation,
                    additional_data: organizationDto.additionalData,
                    origin: organizationDto.origin,
                    parent: organizationDto.parent,
                    importance: organizationDto.importance,
                    token: organizationDto.token,
                    rest_path: organizationDto.restPath,
                    translations: organizationDto.translations,
                    uuid: crypto.randomUUID(),
                    createdAt: organizationDto.createdAt,
                    updatedAt: organizationDto.updatedAt,
                    deletedAt: organizationDto.deletedAt
                }
            })
            return {
                abbreviation: organization.abbreviation,
                modality: organization.modality ? organization.modality : null,
                name: organization.name,
                available: organization.available,
                degree_abbreviation: organization.degree_abbreviation,
                additional_data: organization.additional_data,
                uuid: organization.uuid,
                origin: organization.origin,
                parent: organization.parent,
                importance: organization.importance,
                token: organization.token,
                rest_path: organization.rest_path,
                translations: organization.translations,
                createdAt: organization.createdAt,
                updatedAt: organization.updatedAt,
                deletedAt: organization.deletedAt,
                id: organization.id,
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async getInstitutionByModalityAndAbbreviation(modality: string, abbreviation: string, available: boolean): Promise<OrganizationInterface | null> {
        try {
            const organization = await OrganizationSequelize.findOne({
                where: {
                    abbreviation: abbreviation.toUpperCase(),
                    modality,
                    available: available
                }
            })
            if (!organization) return null;
            return {
                abbreviation: organization.abbreviation,
                modality: organization.modality ? organization.modality : null,
                name: organization.name,
                available: organization.available,
                degree_abbreviation: organization.degree_abbreviation,
                additional_data: organization.additional_data,
                uuid: organization.uuid,
                origin: organization.origin,
                parent: organization.parent,
                importance: organization.importance,
                token: organization.token,
                rest_path: organization.rest_path,
                translations: organization.translations,
                createdAt: organization.createdAt,
                updatedAt: organization.updatedAt,
                deletedAt: organization.deletedAt,
                id: organization.id,
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async getActiveById(id: number): Promise<OrganizationInterface | null> {
        try {
            const organization = await OrganizationSequelize.findOne({
                where: {
                    id,
                    available: true
                }
            })
            if (!organization) return null;
            return {
                abbreviation: organization.abbreviation,
                modality: organization.modality ? organization.modality : null,
                name: organization.name,
                available: organization.available,
                degree_abbreviation: organization.degree_abbreviation,
                additional_data: organization.additional_data,
                uuid: organization.uuid,
                origin: organization.origin,
                parent: organization.parent,
                importance: organization.importance,
                token: organization.token,
                rest_path: organization.rest_path,
                translations: organization.translations,
                createdAt: organization.createdAt,
                updatedAt: organization.updatedAt,
                deletedAt: organization.deletedAt,
                id: organization.id,
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async getOrganizationsByImportance(abbreviation: string[], modality: string, orderImportance?: boolean): Promise<OrganizationInterface[]> {
        try {
            const where: FindOptions = {
                where: {
                    abbreviation: {
                        [Op.in]: abbreviation
                    },
                    modality: modality.toLowerCase()
                },
                order: [
                    ['importance', orderImportance ? 'ASC' : 'DESC']
                ]
            }
            const organizations = await OrganizationSequelize.findAll(where);
            return organizations.map(organization => {
                return {
                    abbreviation: organization.abbreviation,
                    modality: organization.modality ? organization.modality : null,
                    name: organization.name,
                    available: organization.available,
                    degree_abbreviation: organization.degree_abbreviation,
                    additional_data: organization.additional_data,
                    uuid: organization.uuid,
                    origin: organization.origin,
                    parent: organization.parent,
                    importance: organization.importance,
                    token: organization.token,
                    rest_path: organization.rest_path,
                    translations: organization.translations,
                    createdAt: organization.createdAt,
                    updatedAt: organization.updatedAt,
                    deletedAt: organization.deletedAt,
                    id: organization.id,
                }
            })
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async getSignUpOrganization(inscriptionDto: InscriptionDto): Promise<OrganizationInterface> {
        try {
            const element = inscriptionDto;
            const modality = element.modality;

            let organization: OrganizationInterface | null = null;
            //obtienes las organizaciones que esten en degree por modalidad ordenado por importancia
            const organizations = await this.getOrganizationsByImportance(element.degrees.map(degree => degree.abbreviation), "virtual", true);
            if (modality.toLowerCase() === "virtual") {
                //si ecuentro UNIB en el listado este pasa a ser la organizacion principal
                const hasUnib = organizations.find(organization => organization.abbreviation === "UNIB");
                if (hasUnib) { organization = hasUnib };
                //si no encuentro UNIB en el listado busco al padre de la universidad principal
                if (organizations[0].parent) {
                    const parent = await this.getActiveById(organizations[0].parent);
                    if (parent) { organization = parent };
                }

                const programIsMigrated = await new ProgramMigrationDatasourceImpl().programIsMigrated(element.academic_program.abbreviation, element.academic_program.version);

                if (programIsMigrated) {
                    if (element.academic_program.is_scheduled) {
                        //si es calendarizado
                        if (!hasUnib) {
                            //si es especial
                            const organizationFbr = await this.getInstitutionByModalityAndAbbreviation(modality, "fbr", true);
                            if (organizationFbr) {
                                organization = organizationFbr;
                            } else {
                                throw new Error("Institution fbr disabled");
                            }
                        }
                    } else {
                        if (!(new Date(element.registered_at).getFullYear() >= 2024)) {
                            // si la organizacion no es UNIB
                            if (organization?.abbreviation != "UNIB") {
                                const unibOrganization = await this.getInstitutionByModalityAndAbbreviation(modality, "UNIB", true);
                                if (unibOrganization) {
                                    organization = unibOrganization;
                                } else {
                                    throw new Error("Institution unib disabled");
                                }
                            }
                        } else {
                            const programIsSpecial = await new ProgramSpecialDatasourceImpl().programIsSpecial(element.academic_program.abbreviation, element.academic_program.version);
                            if (programIsSpecial) {
                                //si es especial
                                const organizationFbr = await this.getInstitutionByModalityAndAbbreviation(modality, "fbr", true);
                                if (organizationFbr) {
                                    organization = organizationFbr;
                                } else {
                                    throw new Error("Institution fbr disabled");
                                }
                            } else {
                                throw new Error("Programa no especial");
                            }
                        }
                    }
                } else {
                    throw new Error("Programa no migrado");
                }
            } else {
                throw new Error("Modalidad presencial no implementada");
            }
            if (!organization) throw new Error("Organization not evaluated");
            return organization;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
}