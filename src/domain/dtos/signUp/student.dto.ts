import InscriptionDto from "./inscription.dto";

export interface MapperInterfaceError {
    errorAbbreviation: string;
    errorMessage: string;
}

export default class StudentDto {
    constructor(
        public dni: string | null,
        public city: string | null,
        public uuid: string,
        public email: string,
        public phone: string | null,
        public address: string | null,
        public country: string | null,
        public language: string,
        public password: string,
        public last_name: string,
        public user_name: string,
        public created_at: string,
        public first_name: string,
        public inscriptions: InscriptionDto[],
        public reference_id: number,
        public institution_abbreviation: string
    ) {}

    static create(object: { [key: string]: any }): [MapperInterfaceError?, StudentDto?] {
        if (!object.uuid) {
            return [
                {
                    errorAbbreviation: "STUDENT_UUID_REQUIRED",
                    errorMessage: "UUID is required in student",
                },
                undefined,
            ];
        }
        if (!object.email) {
            return [
                {
                    errorAbbreviation: "STUDENT_EMAIL_REQUIRED",
                    errorMessage: "Email is required in student",
                },
                undefined,
            ];
        }
        if (!object.language) {
            return [
                {
                    errorAbbreviation: "STUDENT_LANGUAGE_REQUIRED",
                    errorMessage: "Language is required in student",
                },
                undefined,
            ];
        }
        if (!object.password) {
            return [
                {
                    errorAbbreviation: "STUDENT_PASSWORD_REQUIRED",
                    errorMessage: "Password is required in student",
                },
                undefined,
            ];
        }
        if (!object.last_name) {
            return [
                {
                    errorAbbreviation: "STUDENT_LAST_NAME_REQUIRED",
                    errorMessage: "Last name is required in student",
                },
                undefined,
            ];
        }
        if (!object.user_name) {
            return [
                {
                    errorAbbreviation: "STUDENT_USER_NAME_REQUIRED",
                    errorMessage: "User name is required in student",
                },
                undefined,
            ];
        }
        if (!object.created_at) {
            return [
                {
                    errorAbbreviation: "STUDENT_CREATED_AT_REQUIRED",
                    errorMessage: "Created_at is required in student",
                },
                undefined,
            ];
        }
        if (!object.first_name) {
            return [
                {
                    errorAbbreviation: "STUDENT_FIRST_NAME_REQUIRED",
                    errorMessage: "First name is required in student",
                },
                undefined,
            ];
        }
        if (!object.inscriptions) {
            return [
                {
                    errorAbbreviation: "STUDENT_INSCRIPTIONS_REQUIRED",
                    errorMessage: "Inscriptions is required in student",
                },
                undefined,
            ];
        }
        if (!Array.isArray(object.inscriptions)) {
            return [
                {
                    errorAbbreviation: "STUDENT_INSCRIPTIONS_NOT_ARRAY",
                    errorMessage: "Inscriptions must be an array in student",
                },
                undefined,
            ];
        }
        if (object.inscriptions.length === 0) {
            return [
                {
                    errorAbbreviation: "STUDENT_INSCRIPTIONS_EMPTY",
                    errorMessage: "Inscriptions must have at least one element in student",
                },
                undefined,
            ];
        }

        const inscriptionDtoList: InscriptionDto[] = [];
        for (let inscription of object.inscriptions) {
            const [error, inscriptionDto] = InscriptionDto.create(inscription);
            if (error) {
                return [error, undefined];
            }
            inscriptionDtoList.push(inscriptionDto!);
        }

        if (!object.reference_id) {
            return [
                {
                    errorAbbreviation: "STUDENT_REFERENCE_ID_REQUIRED",
                    errorMessage: "Reference ID is required in student",
                },
                undefined,
            ];
        }
        if (!object.institution_abbreviation) {
            return [
                {
                    errorAbbreviation: "STUDENT_INSTITUTION_ABBREVIATION_REQUIRED",
                    errorMessage: "Institution abbreviation is required in student",
                },
                undefined,
            ];
        }

        return [
            undefined,
            new StudentDto(
                object.dni,
                object.city ? object.city : null,
                object.uuid,
                object.email,
                object.phone ? object.phone : null,
                object.address ? object.address : null,
                object.country ? object.country : null,
                object.language,
                object.password,
                object.last_name,
                object.user_name,
                object.created_at,
                object.first_name,
                inscriptionDtoList,
                object.reference_id,
                object.institution_abbreviation
            ),
        ];
    }
}
