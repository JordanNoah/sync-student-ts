import AcademicProgramDto from "./academicProgram.dto";
import AcademicSelectionDto from "./academicSelection.dto";
import AcademicTermDto from "./academicTerm.dto";

export interface MapperInterfaceError {
    errorAbbreviation: string;
    errorMessage: string;
}

export default class Enrollment {
    constructor(
        public uuid: string,
        public language: string,
        public started_at: Date,
        public reference_id: number,
        public academic_term: AcademicTermDto,
        public academic_program: AcademicProgramDto,
        public academic_selections: AcademicSelectionDto[]
    ) {}

    static create(object: { [key: string]: any }): [MapperInterfaceError?, Enrollment?] {
        if (!object.uuid) {
            return [
                {
                    errorAbbreviation: "ENROLLMENT_UUID_REQUIRED",
                    errorMessage: "UUID is required in enrollment",
                },
                undefined,
            ];
        }
        if (!object.language) {
            return [
                {
                    errorAbbreviation: "ENROLLMENT_LANGUAGE_REQUIRED",
                    errorMessage: "Language is required in enrollment",
                },
                undefined,
            ];
        }
        if (!object.started_at) {
            return [
                {
                    errorAbbreviation: "ENROLLMENT_STARTED_AT_REQUIRED",
                    errorMessage: "Started_at is required in enrollment",
                },
                undefined,
            ];
        }
        if (!object.reference_id) {
            return [
                {
                    errorAbbreviation: "ENROLLMENT_REFERENCE_ID_REQUIRED",
                    errorMessage: "Reference ID is required in enrollment",
                },
                undefined,
            ];
        }
        if (!object.academic_term) {
            return [
                {
                    errorAbbreviation: "ENROLLMENT_ACADEMIC_TERM_REQUIRED",
                    errorMessage: "Academic term is required in enrollment",
                },
                undefined,
            ];
        }

        const [errorAcademicTerm, academicTermDto] = AcademicTermDto.create(object.academic_term);
        if (errorAcademicTerm) {
            return [errorAcademicTerm, undefined];
        }

        if (!object.academic_program) {
            return [
                {
                    errorAbbreviation: "ENROLLMENT_ACADEMIC_PROGRAM_REQUIRED",
                    errorMessage: "Academic program is required in enrollment",
                },
                undefined,
            ];
        }

        const [errorAcademicProgram, academicProgramDto] = AcademicProgramDto.create(object.academic_program);
        if (errorAcademicProgram) {
            return [errorAcademicProgram, undefined];
        }

        if (!object.academic_selections) {
            return [
                {
                    errorAbbreviation: "ENROLLMENT_ACADEMIC_SELECTIONS_REQUIRED",
                    errorMessage: "Academic selections are required in enrollment",
                },
                undefined,
            ];
        }
        if (!Array.isArray(object.academic_selections)) {
            return [
                {
                    errorAbbreviation: "ENROLLMENT_ACADEMIC_SELECTIONS_NOT_ARRAY",
                    errorMessage: "Academic selections must be an array in enrollment",
                },
                undefined,
            ];
        }

        const academicSelectionDtoList: AcademicSelectionDto[] = [];
        for (let selection of object.academic_selections) {
            const [error, academicSelectionDto] = AcademicSelectionDto.create(selection);
            if (error) {
                return [error, undefined];
            }
            academicSelectionDtoList.push(academicSelectionDto!);
        }

        return [
            undefined,
            new Enrollment(
                object.uuid,
                object.language,
                new Date(object.started_at), // Aseguramos conversión a Date
                object.reference_id,
                academicTermDto!,
                academicProgramDto!,
                academicSelectionDtoList
            ),
        ];
    }
}
