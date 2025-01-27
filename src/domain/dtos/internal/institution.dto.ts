export default class InstitutionDto {
    constructor(
        public name: string,
        public abbreviation: string,
        public uuid: string,
        public degree_abbreviation: string,
        public origin: string | null,
        public rest_path: string | null,
        public token: string | null,
        public modality: string | null,
        public additional_data: string | null,
        public translations: string | null,
        public parent: number | null,
        public importance: number | null,
        public available: boolean,
        public id?: number,
        public createdAt?: Date,
        public updatedAt?: Date,
        public deletedAt?: Date | null,
    ){}

    static create(object: { [key: string]: any }):[string?, InstitutionDto?]{
        if (!object.name) {
            return [
                "INSTITUTION_NAME_REQUIRED",
                undefined
            ]
        }
        if (!object.abbreviation) {
            return [
                "INSTITUTION_ABBREVIATION_REQUIRED",
                undefined
            ]
        }
        if (!object.uuid) {
            return [
                "INSTITUTION_UUID_REQUIRED",
                undefined
            ]
        }
        if (!object.rest_path) {
            return [
                "INSTITUTION_REST_PATH_REQUIRED",
                undefined
            ]
        }
        if (!object.token) {
            return [
                "INSTITUTION_TOKEN_REQUIRED",
                undefined
            ]
        }
        if (!object.modality) {
            return [
                "INSTITUTION_MODALITY_REQUIRED",
                undefined
            ]
        }

        if (!object.translations) {
            return [
                "INSTITUTION_TRANSLATIONS_REQUIRED",
                undefined
            ]
        }
        if (!object.parent) {
            return [
                "INSTITUTION_PARENT_REQUIRED",
                undefined
            ]
        }
        if (!object.importance) {
            return [
                "INSTITUTION_IMPORTANCE_REQUIRED",
                undefined
            ]
        }
        if (!object.available) {
            return [
                "INSTITUTION_AVAILABLE_REQUIRED",
                undefined
            ]
        }
        return [
            undefined,
            new InstitutionDto(
                object.name,
                object.abbreviation,
                object.uuid,
                object.degree_abbreviation,
                object.origin,
                object.rest_path,
                object.token,
                object.modality,
                object.additional_data,
                object.translations,
                object.parent,
                object.importance,
                object.available,
                object.id,
                object.createdAt,
                object.updatedAt,
                object.deletedAt
            )
        ]
    }
}