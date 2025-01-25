import {MapperInterfaceError} from "../../../shared/interfaces";
export default class AcademicElementDto {
    constructor(
        public name: string,
        public type: string,
        public uuid: string | null,
        public version: string,
        public language: string | null,
        public abbreviation: string | null,
        public reference_id: number,
        public reference_type: string,
        public reference_class: string
    ) {}

    static create(object: { [key: string]: any }): [MapperInterfaceError? , AcademicElementDto?] {
        if (!object.name) {
            return [{
                errorAbbreviation: "ACADEMICELEMENT_NAME_REQUIRED",
                errorMessage: "Name is required in academic element",
            }, undefined];
        }
        if (!object.type) {
            return [{
                errorAbbreviation: "ACADEMICELEMENT_TYPE_REQUIRED",
                errorMessage: "Type is required in academic element",
            }, undefined];
        }
        if (!object.version) {
            return [{
                errorAbbreviation: "ACADEMICELEMENT_VERSION_REQUIRED",
                errorMessage: "Version is required in academic element",
            }, undefined];
        }
        if (!object.reference_id) {
            return [{
                errorAbbreviation: "ACADEMICELEMENT_REFERENCE_ID_REQUIRED",
                errorMessage: "Reference ID is required in academic element",
            }, undefined];
        }
        if (!object.reference_type) {
            return [{
                errorAbbreviation: "ACADEMICELEMENT_REFERENCE_TYPE_REQUIRED",
                errorMessage: "Reference type is required in academic element",
            }, undefined];
        }
        if (!object.reference_class) {
            return [{
                errorAbbreviation: "ACADEMICELEMENT_REFERENCE_CLASS_REQUIRED",
                errorMessage: "Reference class is required in academic element",
            }, undefined];
        }

        return [undefined, new AcademicElementDto(
            object.name,
            object.type,
            object.uuid,
            object.version,
            object.language || null,
            object.abbreviation || null,
            object.reference_id,
            object.reference_type,
            object.reference_class
        )]
    }
}
