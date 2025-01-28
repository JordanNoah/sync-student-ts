import {MapperInterfaceError} from "../../../shared/interfaces";
export default class AcademicTermDto {
    constructor(
        public started_at: string,
        public finished_at: string,
        public study_model: string,
        public reference_id: number,
        public school_period: string
    ) {}

    static create(object: { [key: string]: any }): [MapperInterfaceError?, AcademicTermDto?] {
        if (!object.started_at) {
            return [
                {
                    errorAbbreviation: "ACADEMICTERM_STARTED_AT_REQUIRED",
                    errorMessage: "Started_at is required in academic term",
                },
                undefined,
            ];
        }
        if (!object.finished_at) {
            return [
                {
                    errorAbbreviation: "ACADEMICTERM_FINISHED_AT_REQUIRED",
                    errorMessage: "Finished_at is required in academic term",
                },
                undefined,
            ];
        }
        if (!object.study_model) {
            return [
                {
                    errorAbbreviation: "ACADEMICTERM_STUDY_MODEL_REQUIRED",
                    errorMessage: "Study_model is required in academic term",
                },
                undefined,
            ];
        }
        if (!object.reference_id) {
            return [
                {
                    errorAbbreviation: "ACADEMICTERM_REFERENCE_ID_REQUIRED",
                    errorMessage: "Reference ID is required in academic term",
                },
                undefined,
            ];
        }
        if (!object.school_period) {
            return [
                {
                    errorAbbreviation: "ACADEMICTERM_SCHOOL_PERIOD_REQUIRED",
                    errorMessage: "School_period is required in academic term",
                },
                undefined,
            ];
        }

        return [
            undefined,
            new AcademicTermDto(
                object.started_at, // Convertimos a Date
                object.finished_at, // Convertimos a Date
                object.study_model,
                object.reference_id,
                object.school_period
            ),
        ];
    }
}
