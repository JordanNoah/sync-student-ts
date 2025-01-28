import AcademicProgramDto from "./academicProgram.dto";
import DegreeDto from "./degree.dto";
import EnrollmentDto from "./enrollment.dto";
import IntroductoryModuleDto from "./introductoryModule.dto";

export interface MapperInterfaceError {
    errorAbbreviation: string;
    errorMessage: string;
}

export default class InscriptionDto {
    constructor(
        public uuid: string,
        public active: boolean | number,
        public status: string,
        public degrees: DegreeDto[],
        public language: string,
        public modality: string,
        public incidence: string,
        public created_at: string,
        public started_at: string,
        public enrollments: EnrollmentDto[],
        public finished_at: string,
        public reference_id: number,
        public registered_at: string,
        public academic_program: AcademicProgramDto,
        public introductory_module: IntroductoryModuleDto[],
        public extension_finished_at: string,
        public institution_abbreviation: string
    ) {}

    static create(object: { [key: string]: any }): [MapperInterfaceError?, InscriptionDto?] {
        if (!object.uuid) {
            return [
                { errorAbbreviation: "INSCRIPTION_UUID_REQUIRED", errorMessage: "UUID is required in inscription" },
                undefined,
            ];
        }
        if (object.active === undefined) {
            return [
                { errorAbbreviation: "INSCRIPTION_ACTIVE_REQUIRED", errorMessage: "Active is required in inscription" },
                undefined,
            ];
        }
        if (!object.status) {
            return [
                { errorAbbreviation: "INSCRIPTION_STATUS_REQUIRED", errorMessage: "Status is required in inscription" },
                undefined,
            ];
        }
        if (!object.degrees || !Array.isArray(object.degrees) || object.degrees.length === 0) {
            return [
                {
                    errorAbbreviation: "INSCRIPTION_DEGREES_REQUIRED",
                    errorMessage: "Degrees must be a non-empty array in inscription",
                },
                undefined,
            ];
        }

        const degreeDtoList: DegreeDto[] = [];
        for (let degree of object.degrees) {
            const [degreeError, degreeDto] = DegreeDto.create(degree);
            if (degreeError) return [degreeError, undefined];
            degreeDtoList.push(degreeDto!);
        }

        if (!object.language) {
            return [
                { errorAbbreviation: "INSCRIPTION_LANGUAGE_REQUIRED", errorMessage: "Language is required in inscription" },
                undefined,
            ];
        }
        if (!object.modality) {
            return [
                { errorAbbreviation: "INSCRIPTION_MODALITY_REQUIRED", errorMessage: "Modality is required in inscription" },
                undefined,
            ];
        }
        if (!object.incidence) {
            return [
                { errorAbbreviation: "INSCRIPTION_INCIDENCE_REQUIRED", errorMessage: "Incidence is required in inscription" },
                undefined,
            ];
        }
        if (!object.created_at || !object.started_at || !object.finished_at || !object.registered_at) {
            return [
                {
                    errorAbbreviation: "INSCRIPTION_DATE_REQUIRED",
                    errorMessage: "All date fields (created_at, started_at, finished_at, registered_at) are required in inscription",
                },
                undefined,
            ];
        }
        if (!object.enrollments || !Array.isArray(object.enrollments)) {
            return [
                {
                    errorAbbreviation: "INSCRIPTION_ENROLLMENTS_REQUIRED",
                    errorMessage: "Enrollments must be a non-empty array in inscription",
                },
                undefined,
            ];
        }

        const enrollmentDtoList: EnrollmentDto[] = [];
        for (let enrollment of object.enrollments) {
            const [enrollmentError, enrollmentDto] = EnrollmentDto.create(enrollment);            
            if (enrollmentError) return [enrollmentError, undefined];
            enrollmentDtoList.push(enrollmentDto!);
        }

        if (!object.academic_program) {
            return [
                { errorAbbreviation: "INSCRIPTION_ACADEMIC_PROGRAM_REQUIRED", errorMessage: "Academic program is required in inscription" },
                undefined,
            ];
        }

        const [academicProgramError, academicProgramDto] = AcademicProgramDto.create(object.academic_program);
        if (academicProgramError) return [academicProgramError, undefined];

        if (!object.introductory_module || !Array.isArray(object.introductory_module)) {
            return [
                {
                    errorAbbreviation: "INSCRIPTION_INTRODUCTORY_MODULE_REQUIRED",
                    errorMessage: "Introductory module must be a non-empty array in inscription",
                },
                undefined,
            ];
        }

        const introductoryModuleDtoList: IntroductoryModuleDto[] = [];
        for (let module of object.introductory_module) {
            const [moduleError, moduleDto] = IntroductoryModuleDto.create(module);
            if (moduleError) return [moduleError, undefined];
            introductoryModuleDtoList.push(moduleDto!);
        }

        if (!object.extension_finished_at) {
            return [
                {
                    errorAbbreviation: "INSCRIPTION_EXTENSION_FINISHED_AT_REQUIRED",
                    errorMessage: "Extension finished at is required in inscription",
                },
                undefined,
            ];
        }
        if (!object.institution_abbreviation) {
            return [
                {
                    errorAbbreviation: "INSCRIPTION_INSTITUTION_ABBREVIATION_REQUIRED",
                    errorMessage: "Institution abbreviation is required in inscription",
                },
                undefined,
            ];
        }

        return [
            undefined,
            new InscriptionDto(
                object.uuid,
                object.active,
                object.status,
                degreeDtoList,
                object.language,
                object.modality,
                object.incidence,
                object.created_at,
                object.started_at,
                enrollmentDtoList,
                object.finished_at,
                object.reference_id,
                object.registered_at,
                academicProgramDto!,
                introductoryModuleDtoList,
                object.extension_finished_at,
                object.institution_abbreviation
            ),
        ];
    }
}
