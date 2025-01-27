export default class OrganizationDto {
    constructor(
        public id: number,
        public name: string,
        public abbreviation: string,
        public degreeAbbreviation: string,
        public origin: string | null,
        public restPath: string | null,
        public token: string | null,
        public modality: string | null,
        public additionalData: string | null,
        public translations: string,
        public parent: number | null,
        public importance: number | null,
        public available: boolean,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date | null
    ) {}

    static create(object: { [key: string]: any }): [string?, OrganizationDto?] {        
        if (!object.name) {
            return [
                "Name is required in the organization object",
                undefined,
            ];
        }

        if (!object.abbreviation) {
            return [
                "Abbreviation is required in the organization object",
                undefined,
            ];
        }

        if (!object.degree_abbreviation) {
            return [
                "Degree abbreviation is required in the organization object",
                undefined,
            ];
        }

        if (!object.translations || typeof object.translations !== "object") {
            return [
                "Translations must be a valid object",
                undefined,
            ];
        }

        return [
            undefined,
            new OrganizationDto(
                object.id,
                object.name,
                object.abbreviation,
                object.degreeAbbreviation,
                object.origin || null,
                object.rest_path || null,
                object.token || null,
                object.modality || null,
                object.additionalData || null,
                object.translations,
                object.parent || null,
                object.importance || null,
                Boolean(object.available),
                new Date(object.createdAt || Date.now()),
                new Date(object.updatedAt || Date.now()),
                object.deletedAt ? new Date(object.deletedAt) : null
            ),
        ];
    }
}
