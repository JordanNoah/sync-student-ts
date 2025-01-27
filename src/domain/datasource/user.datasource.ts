import { CourseInterface, MapperAcademicElement, MoodleErrorInterface, OrganizationInterface, UserInterface } from "../../shared/interfaces";
import StudentDto from "../dtos/signUp/student.dto";

export default abstract class UserDatasource {
    abstract createUser(userInterface: UserInterface, organization:OrganizationInterface): Promise<UserInterface>
    abstract getUserByUsernameAndInstitution(userName:string, institutionAbbreviation:string, modality:string): Promise<UserInterface | null>
    abstract createUserInMoodle(studentDto: StudentDto, organization:OrganizationInterface): Promise<UserInterface | MoodleErrorInterface>
    abstract updateUserInMoodle(userInterface: UserInterface, studentDto: StudentDto, organization:OrganizationInterface): Promise<UserInterface>
    abstract getEnrolledCoursesByUserId(userId: number, institutionAbbr:string, institutionModality:string): Promise<any>
    abstract unenrollMasiveUserMoodle(enrollment: any[], userId: number, organization:OrganizationInterface): Promise<void>
    abstract enrollUserInCourses(course: CourseInterface[], userId: number, mapperAcademicElement: MapperAcademicElement[], organization:OrganizationInterface, payload:Object): Promise<void>
}