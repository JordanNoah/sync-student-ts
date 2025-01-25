export interface MapperInterfaceError {
    errorAbbreviation: string;
    errorMessage: string;
}

export default class DegreeDto {
    constructor(
        public active: boolean,
        public status: string,
        public incidence: string,
        public abbreviation: string,
        public reference_id: number
    ) {}

    static create(object: { [key: string]: any }): [MapperInterfaceError?, DegreeDto?] {
        if (!object.status) {
            return [
                {
                    errorAbbreviation: "DEGREE_STATUS_REQUIRED",
                    errorMessage: "Status is required in degree",
                },
                undefined,
            ];
        }
        if (typeof object.status !== "string") {
            return [
                {
                    errorAbbreviation: "DEGREE_STATUS_INVALID_TYPE",
                    errorMessage: "Status must be a string in degree",
                },
                undefined,
            ];
        }
        if (!object.incidence) {
            return [
                {
                    errorAbbreviation: "DEGREE_INCIDENCE_REQUIRED",
                    errorMessage: "Incidence is required in degree",
                },
                undefined,
            ];
        }
        if (typeof object.incidence !== "string") {
            return [
                {
                    errorAbbreviation: "DEGREE_INCIDENCE_INVALID_TYPE",
                    errorMessage: "Incidence must be a string in degree",
                },
                undefined,
            ];
        }
        if (!object.abbreviation) {
            return [
                {
                    errorAbbreviation: "DEGREE_ABBREVIATION_REQUIRED",
                    errorMessage: "Abbreviation is required in degree",
                },
                undefined,
            ];
        }
        if (typeof object.abbreviation !== "string") {
            return [
                {
                    errorAbbreviation: "DEGREE_ABBREVIATION_INVALID_TYPE",
                    errorMessage: "Abbreviation must be a string in degree",
                },
                undefined,
            ];
        }
        if (!object.reference_id) {
            return [
                {
                    errorAbbreviation: "DEGREE_REFERENCE_ID_REQUIRED",
                    errorMessage: "Reference ID is required in degree",
                },
                undefined,
            ];
        }
        if (typeof object.reference_id !== "number") {
            return [
                {
                    errorAbbreviation: "DEGREE_REFERENCE_ID_INVALID_TYPE",
                    errorMessage: "Reference ID must be a number in degree",
                },
                undefined,
            ];
        }

        return [
            undefined,
            new DegreeDto(
                object.active,
                object.status,
                object.incidence,
                object.abbreviation,
                object.reference_id
            ),
        ];
    }
}
