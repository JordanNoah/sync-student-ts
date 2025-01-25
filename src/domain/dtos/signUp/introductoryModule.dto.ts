import AcademicElementDto from "./academicElement.dto";

export interface MapperInterfaceError {
    errorAbbreviation: string;
    errorMessage: string;
}

export default class IntroductoryModuleDto {
    constructor(
        public name: string,
        public type: string,
        public uuid: string,
        public version: string,
        public abbreviation: string,
        public reference_id: number,
        public academic_element: AcademicElementDto[],
    ) {}

    static create(object: { [key: string]: any }): [MapperInterfaceError?, IntroductoryModuleDto?] {
        if (!object.name) {
            return [
                {
                    errorAbbreviation: "INTRODUCTORYMODULE_NAME_REQUIRED",
                    errorMessage: "Name is required in introductory module",
                },
                undefined,
            ];
        }
        if (!object.type) {
            return [
                {
                    errorAbbreviation: "INTRODUCTORYMODULE_TYPE_REQUIRED",
                    errorMessage: "Type is required in introductory module",
                },
                undefined,
            ];
        }
        if (!object.uuid) {
            return [
                {
                    errorAbbreviation: "INTRODUCTORYMODULE_UUID_REQUIRED",
                    errorMessage: "UUID is required in introductory module",
                },
                undefined,
            ];
        }
        if (!object.version) {
            return [
                {
                    errorAbbreviation: "INTRODUCTORYMODULE_VERSION_REQUIRED",
                    errorMessage: "Version is required in introductory module",
                },
                undefined,
            ];
        }
        if (!object.abbreviation) {
            return [
                {
                    errorAbbreviation: "INTRODUCTORYMODULE_ABBREVIATION_REQUIRED",
                    errorMessage: "Abbreviation is required in introductory module",
                },
                undefined,
            ];
        }
        if (!object.reference_id) {
            return [
                {
                    errorAbbreviation: "INTRODUCTORYMODULE_REFERENCE_ID_REQUIRED",
                    errorMessage: "Reference ID is required in introductory module",
                },
                undefined,
            ];
        }
        if (!object.academic_element) {
            return [
                {
                    errorAbbreviation: "INTRODUCTORYMODULE_ACADEMIC_ELEMENT_REQUIRED",
                    errorMessage: "Academic element is required in introductory module",
                },
                undefined,
            ];
        }
        if (!Array.isArray(object.academic_element)) {
            return [
                {
                    errorAbbreviation: "INTRODUCTORYMODULE_ACADEMIC_ELEMENT_NOT_ARRAY",
                    errorMessage: "Academic element must be an array in introductory module",
                },
                undefined,
            ];
        }
        if (object.academic_element.length === 0) {
            return [
                {
                    errorAbbreviation: "INTRODUCTORYMODULE_ACADEMIC_ELEMENT_EMPTY",
                    errorMessage: "Academic element must have at least one element in introductory module",
                },
                undefined,
            ];
        }

        const academicElementDtoList: AcademicElementDto[] = [];
        for (let academicElement of object.academic_element) {
            const [error, academicElementDto] = AcademicElementDto.create(academicElement);
            if (error) {
                return [error, undefined];
            }
            academicElementDtoList.push(academicElementDto!);
        }

        return [
            undefined,
            new IntroductoryModuleDto(
                object.name,
                object.type,
                object.uuid,
                object.version,
                object.abbreviation,
                object.reference_id,
                academicElementDtoList
            ),
        ];
    }
}
