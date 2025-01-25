import StudentDto from "./student.dto";

export interface MapperInterfaceError {
    errorAbbreviation: string;
    errorMessage: string;
}

export default class SignUpDto {
    constructor(
        public uuid: string,
        public student: StudentDto,
        public fired_at: Date,
    ) {}

    static create(object: { [key: string]: any }): [MapperInterfaceError?, SignUpDto?] {
        if (!object.uuid) {
            return [
                {
                    errorAbbreviation: "SIGNUP_UUID_REQUIRED",
                    errorMessage: "UUID is required in sign up",
                },
                undefined,
            ];
        }
        if (!object.student) {
            return [
                {
                    errorAbbreviation: "SIGNUP_STUDENT_REQUIRED",
                    errorMessage: "Student is required in sign up",
                },
                undefined,
            ];
        }

        const [studentError, student] = StudentDto.create(object.student);
        if (studentError) {
            return [studentError, undefined];
        }

        if (!object.fired_at) {
            return [
                {
                    errorAbbreviation: "SIGNUP_FIRED_AT_REQUIRED",
                    errorMessage: "Fired_at is required in sign up",
                },
                undefined,
            ];
        }

        return [
            undefined,
            new SignUpDto(
                object.uuid,
                student!,
                new Date(object.fired_at) // Convertimos a Date para garantizar la consistencia
            ),
        ];
    }
}
