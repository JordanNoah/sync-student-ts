import OrganizationDto from "@/domain/dtos/internal/organization.dto";
import OrganizationDatasource from "../../domain/datasource/organization.datasource";
import { CustomError } from "../../shared/errors/custom.error";
import { OrganizationInterface } from "../../shared/interfaces";
import { OrganizationSequelize } from "../database/models/Organization";
import { FindOptions, Op } from "sequelize";

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
    async getInstitutionByModalityAndAbbreviation(modality: string, abbreviation: string, available:boolean): Promise<OrganizationInterface | null> {
        try {
            const organization = await OrganizationSequelize.findOne({
                where: {
                    abbreviation,
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
}