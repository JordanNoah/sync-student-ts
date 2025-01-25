import AcademicElementDto from "./academicElement.dto";
import {MapperInterfaceError} from "../../../shared/interfaces";

export default class AcademicSelectionDto {
    constructor(
        public uuid: string,
        public started_at: string,
        public admission_id: number,
        public reference_id: number,
        public academic_element: AcademicElementDto[],
    ) {}

    static create(object: { [key: string]: any }): [MapperInterfaceError?, AcademicSelectionDto?] {
        if (!object.uuid) {
            return [{
                errorAbbreviation: "ACADEMICSELECTION_UUID_REQUIRED",
                errorMessage: "UUID is required in academic selection",
            },undefined];
        }
        if (!object.started_at) {
            return [{
                errorAbbreviation: "ACADEMICSELECTION_STARTED_AT_REQUIRED",
                errorMessage: "Started_at is required in academic selection",
            },undefined];
        }
        if (!object.admission_id) {
            return [{
                errorAbbreviation: "ACADEMICSELECTION_ADMISSION_ID_REQUIRED",
                errorMessage: "Admission ID is required in academic selection",
            },undefined];
        }
        if (!object.reference_id) {
            return [{
                errorAbbreviation: "ACADEMICSELECTION_REFERENCE_ID_REQUIRED",
                errorMessage: "Reference ID is required in academic selection",
            },undefined];
        }
        if (!object.academic_element) {
            return [{
                errorAbbreviation: "ACADEMICSELECTION_ACADEMIC_ELEMENT_REQUIRED",
                errorMessage: "Academic element is required in academic selection",
            },undefined];
        }
        if (!Array.isArray(object.academic_element)) {
            return [{
                errorAbbreviation: "ACADEMICSELECTION_ACADEMIC_ELEMENT_NOT_ARRAY",
                errorMessage: "Academic element must be an array in academic selection",
            },undefined];
        }
        if (object.academic_element.length === 0) {
            return [{
                errorAbbreviation: "ACADEMICSELECTION_ACADEMIC_ELEMENT_EMPTY",
                errorMessage: "Academic element must have at least one element in academic selection",
            },undefined];
        }

        const academicElementDtoList: AcademicElementDto[] = [];
        for (let i = 0; i < object.academic_element.length; i++) {
            const [errorAcademicElement, academicElementDto] = AcademicElementDto.create(object.academic_element[i]);
            if (errorAcademicElement) {
                return [errorAcademicElement, undefined];
            }
            if (academicElementDto!.reference_class != 'Actividad') {
                academicElementDtoList.push(academicElementDto!);
            }
        }

        return [undefined, new AcademicSelectionDto(
            object.uuid,
            object.started_at,
            object.admission_id,
            object.reference_id,
            academicElementDtoList
        )];
    }
}
