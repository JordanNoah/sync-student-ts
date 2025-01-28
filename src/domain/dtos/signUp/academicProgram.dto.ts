export interface MapperInterfaceError {
    errorAbbreviation: string;
    errorMessage: string;
}

export default class AcademicProgramDto {
    constructor(
        public name: string,
        public type: string,
        public uuid: string,
        public version: string,
        public language: string,
        public abbreviation: string,
        public reference_id: number,
        public is_scheduled: boolean | number,
    ) {}

    static create(object: { [key: string]: any }): [MapperInterfaceError?, AcademicProgramDto?] {
        if (!object.name) {
            return [
                {
                    errorAbbreviation: "ACADEMICPROGRAM_NAME_REQUIRED",
                    errorMessage: "Name is required in academic program",
                },
                undefined,
            ];
        }
        if (!object.type) {
            return [
                {
                    errorAbbreviation: "ACADEMICPROGRAM_TYPE_REQUIRED",
                    errorMessage: "Type is required in academic program",
                },
                undefined,
            ];
        }
        if (!object.uuid) {
            return [
                {
                    errorAbbreviation: "ACADEMICPROGRAM_UUID_REQUIRED",
                    errorMessage: "UUID is required in academic program",
                },
                undefined,
            ];
        }
        if (!object.version) {
            return [
                {
                    errorAbbreviation: "ACADEMICPROGRAM_VERSION_REQUIRED",
                    errorMessage: "Version is required in academic program",
                },
                undefined,
            ];
        }
        if (!object.language) {
            return [
                {
                    errorAbbreviation: "ACADEMICPROGRAM_LANGUAGE_REQUIRED",
                    errorMessage: "Language is required in academic program",
                },
                undefined,
            ];
        }
        if (!object.abbreviation) {
            return [
                {
                    errorAbbreviation: "ACADEMICPROGRAM_ABBREVIATION_REQUIRED",
                    errorMessage: "Abbreviation is required in academic program",
                },
                undefined,
            ];
        }
        if (!object.reference_id) {
            return [
                {
                    errorAbbreviation: "ACADEMICPROGRAM_REFERENCE_ID_REQUIRED",
                    errorMessage: "Reference ID is required in academic program",
                },
                undefined,
            ];
        }

        return [
            undefined,
            new AcademicProgramDto(
                object.name,
                object.type,
                object.uuid,
                object.version,
                object.language,
                object.abbreviation,
                object.reference_id,
                object.is_schedule,
            ),
        ];
    }
}
