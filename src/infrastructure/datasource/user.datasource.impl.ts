import StudentDto from "@/domain/dtos/signUp/student.dto";
import UserDatasource from "../../domain/datasource/user.datasource";
import { CustomError } from "../../shared/errors/custom.error";
import { CourseInterface, EnrollmentMoodleInterface, MapperAcademicElement, OrganizationInterface, UserInterface } from "../../shared/interfaces";
import EducationalSyncProvider from "../client/educationalSync";
import MoodleProvider from "../client/moodle";

export default class UserDatasourceImpl implements UserDatasource {
    async createUser(userInterface: UserInterface): Promise<UserInterface> {
        try {
            // Call to moodle to create a user

            return userInterface;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }

    async getUserByUsernameAndInstitution(userName: string, institutionAbbreviation: string, modality: string): Promise<UserInterface | null> {
        try {
            const user = await new EducationalSyncProvider().getUserByUsernameAndInstitution(userName, institutionAbbreviation, modality);
            
            if (user.data == null) return null;
            const userExternal =  user.data;
            const interfaceUser: UserInterface = {
                address: userExternal.address ? userExternal.address : null,
                city: userExternal.city ? userExternal.city : null,
                country: userExternal.country ? userExternal.country : null,
                email: userExternal.email,
                firstname: userExternal.first_name,
                idnumber: userExternal.id_number,
                lastname: userExternal.last_name,
                phone1: userExternal.phone1 ? user.data.phone1 : "",
                suspended: 0,
                username: user.data.username,
                id: user.data.external_id,
            }
                        
            return interfaceUser;
        } catch (error) {
            console.log(error);
            
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }

    async updateUserInMoodle(userInterface: UserInterface, studentDto: StudentDto, organization: OrganizationInterface): Promise<UserInterface> {
        try {
            userInterface.address = studentDto.address ? studentDto.address : null;
            userInterface.city = studentDto.city ? studentDto.city : null;
            userInterface.country = studentDto.country ? studentDto.country : null;
            userInterface.email = studentDto.email;
            userInterface.firstname = studentDto.first_name;
            userInterface.idnumber = studentDto.uuid;
            userInterface.lastname = studentDto.last_name;
            userInterface.phone1 = studentDto.phone ? studentDto.phone : "";
            userInterface.suspended = 0;
            userInterface.username = studentDto.user_name.toLowerCase();
            userInterface.password = studentDto.password
            await new MoodleProvider(organization).updateUser(userInterface)
            return userInterface;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }

    async createUserInMoodle(studentDto: StudentDto, organization:OrganizationInterface): Promise<UserInterface> {
        try {
            const interfaceUser: UserInterface = {
                address: studentDto.address ? studentDto.address : null,
                city: studentDto.city ? studentDto.city : null,
                country: studentDto.country ? studentDto.country : null,
                email: studentDto.email,
                firstname: studentDto.first_name,
                idnumber: studentDto.uuid,
                lastname: studentDto.last_name,
                phone1 : studentDto.phone ? studentDto.phone : "",
                username: studentDto.user_name.toLowerCase(),
                password: studentDto.password,
            }
            const response: any = await new MoodleProvider(organization).createUser(interfaceUser)
            if ('exception' in response) {
                const updateResponse: any = await new MoodleProvider(organization).updateUser(interfaceUser)
                if ('exception' in updateResponse) {
                    throw CustomError.internalSever(updateResponse.message);
                }
            }else{
                interfaceUser.id = response.user[0].id;
            }
            
            return interfaceUser;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async getEnrolledCoursesByUserId(userId: number, institutionAbbr:string, institutionModality:string): Promise<any[]> {
        try {
            const courses = await new EducationalSyncProvider().getEnrollmentsByUserId(userId, institutionAbbr, institutionModality);            
            return courses.data;
        } catch (error) {
            console.log('error', error);
            
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async unenrollMasiveUserMoodle(enrollment: any[], userId: number, organization:OrganizationInterface): Promise<void> {
        try {
            const enrolmentInterface: EnrollmentMoodleInterface[] = enrollment.map((e) => {
                return {
                    userid:userId,
                    courseid:e.course.external_id,
                } as EnrollmentMoodleInterface
            })

            const response:any = await new MoodleProvider(organization).unenrollMasiveUserMoodle(enrolmentInterface);
            if (!response.data) {
                console.log("usuario desenrolado");
            }else if('errorcode' in response.data){
                throw CustomError.internalSever(response.data.message);
            }
            
            //throw new Error("Method not implemented.");
            // Call to moodle to unenroll user
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
    async enrollUserInCourses(course: CourseInterface[], userId: number, mapperAcademicElement: MapperAcademicElement[],organization:OrganizationInterface, payload:Object): Promise<void> {
        try {
            const enrollments = course.map((c) => {
                const academicElement = mapperAcademicElement.find((m) => m.uuid === c.id_number)
                return {
                    courseid: c.external_id,
                    userid: userId,
                    roleid: 5,
                    timestart: academicElement ? academicElement.startedAt : new Date().getTime(),
                    timeend: academicElement ? academicElement.finishedAt : null,
                } as EnrollmentMoodleInterface
            });
            
            const response:any = await new MoodleProvider(organization).enrollMasiveUserMoodle(enrollments);
            if (!response.data) {
                console.log("usuario enrolado");
            }else if('errorcode' in response.data){
                throw CustomError.internalSever(response.data.message);
            }
            
            // Call to moodle to enroll user in course
        } catch (error) {            
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
}