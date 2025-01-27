import { AddGroupInterface, GroupingsInterface, GroupsInterface, MapperAcademicElement, OrganizationInterface, UserInterface } from "@/shared/interfaces";
import ProcessorDatasource from "../../domain/datasource/processor.datasource";
import SignUpDto from "../../domain/dtos/signUp/signUp.dto";
import EducationalSyncProvider from "../client/educationalSync";
import MoodleProvider from "../client/moodle";
import InstitutionDatasourceImpl from "./organization.datasource.impl";
import UserDatasourceImpl from "./user.datasource.impl";
import AcademicElementDto from "@/domain/dtos/signUp/academicElement.dto";
import CourseDatasourceImpl from "./course.datasource.impl";
import GroupsManagerDatasourceImpl from "./group.datasource.impl";
import OrganizationDatasourceImpl from "./organization.datasource.impl";
import DegreeDto from "@/domain/dtos/signUp/degree.dto";

export default class ProcessorDatasourceImpl implements ProcessorDatasource {
    sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async signUp(payload: Object): Promise<void> {
        const [errorSigUp, signUpDto] = SignUpDto.create(payload);
        if (errorSigUp) {
            if (errorSigUp.errorAbbreviation === "ACADEMICELEMENT_NAME_REQUIRED") {
                console.log("enviar correo a configuracion_campus");
            }
            //to do throw error
            return;
        } else {

            for (let i = 0; i < signUpDto!.student.inscriptions.length; i++) {
                const inscription = signUpDto!.student.inscriptions[i];

                const institutionMoodle = await new InstitutionDatasourceImpl().getInstitutionByModalityAndAbbreviation(inscription.modality, signUpDto!.student.institution_abbreviation, true);

                if (!institutionMoodle) throw new Error("Institution not found");
                // get user by username and institution abbreviation
                const userDatasourceImpl = new UserDatasourceImpl()
                let user = await userDatasourceImpl.getUserByUsernameAndInstitution(signUpDto!.student.user_name, signUpDto!.student.institution_abbreviation, inscription.modality)
                if (user != null) {
                    user = await userDatasourceImpl.updateUserInMoodle(user, signUpDto!.student, institutionMoodle)
                } else {
                    user = await userDatasourceImpl.createUserInMoodle(signUpDto!.student, institutionMoodle)
                }

                const enrollments = await userDatasourceImpl.getEnrolledCoursesByUserId(user.id!, institutionMoodle.abbreviation, inscription.modality)

                if (enrollments.length > 0) {
                    await userDatasourceImpl.unenrollMasiveUserMoodle(enrollments, user.id!, institutionMoodle)
                }

                let importanceDegreeOrganization: OrganizationInterface[] = []
                for (const element of inscription.degrees) {
                    const organizationDb = await new InstitutionDatasourceImpl().getInstitutionByModalityAndAbbreviation(inscription.modality.toLocaleLowerCase(), element.abbreviation, false)
                    if (organizationDb){
                        importanceDegreeOrganization.push(organizationDb)
                    }
                }
//ordenamos por importancia las organizaciones
                if (importanceDegreeOrganization.length > 1) {
                    importanceDegreeOrganization = importanceDegreeOrganization.sort((a, b) => {
                        const importanceA = a.importance ?? Number.MAX_SAFE_INTEGER;
                        const importanceB = b.importance ?? Number.MAX_SAFE_INTEGER;
                        return importanceA - importanceB;
                    })
                }

                for (let j = 0; j < inscription.enrollments.length; j++) {
                    const enrollment = inscription.enrollments[j];
                    let uuids: MapperAcademicElement[] = []
                    uuids.push({ uuid: `${enrollment.academic_program.uuid}||${enrollment.academic_program.version}`, startedAt: enrollment.started_at.getTime() })
                    for (let i = 0; i < enrollment.academic_selections.length; i++) {
                        const element = enrollment.academic_selections[i];
                        const academicElemet = element.academic_element.filter((e: AcademicElementDto) => e.reference_class === "AsignaturaVersion")
                        if (academicElemet.length > 0) {
                            const uuidsAcademic = academicElemet.map((e: AcademicElementDto) => {
                                return {
                                    uuid: `${e.uuid}||${e.version}`,
                                    startedAt: inscription.started_at.getTime(),
                                    finishedAt: inscription.extension_finished_at.getTime()
                                } as MapperAcademicElement
                            })
                            uuids.push(...uuidsAcademic)
                        }
                    }
                    const courses = await new CourseDatasourceImpl().getCoursesByInstitutionAbbrAndModality(uuids.map((e) => e.uuid), institutionMoodle.abbreviation, inscription.modality)
                    if (courses.missingCourse.length > 0) {
                        //todo enviar correo a configuracion_campus
                    }
                    
                    await userDatasourceImpl.enrollUserInCourses(courses.existCourse, user.id!, uuids, institutionMoodle, payload)

                    for (let i = 0; i < courses.existCourse.length; i++) {
                        const element = courses.existCourse[i].external_id;
                        const getgroup = await new GroupsManagerDatasourceImpl().getGroupById(element, institutionMoodle)



                        const filteredGroupLang = getgroup.find((e) => e.idNumber === `asdfqwe.lang.${enrollment.academic_program.language}`)
                        const filteredGroupOrg = getgroup.find((e) => e.idNumber === `asdfqwe.org.${importanceDegreeOrganization[0].abbreviation.toLowerCase()}`)
                        const filteredGroupProg = getgroup.find((e) => e.idNumber === `asdfqwe.program.${enrollment.academic_program.abbreviation}`)

                        let toCreateGroup: GroupsInterface[] = []
                        let toAssignGroup: AddGroupInterface[] = []

                        if (!filteredGroupLang){
                            toCreateGroup.push({
                                courseid: element, 
                                idnumber: `asdfqwe.lang.${enrollment.academic_program.language}`, 
                                name: `asdfqwe.lang.${enrollment.academic_program.language}`,
                                description: `asdfqwe.lang.${enrollment.academic_program.language}`,
                                descriptionformat: 1,
                            })
                        }else{
                            toAssignGroup.push({
                                groupid: filteredGroupLang.id,
                                userid: user.id!
                            })
                        }
                            
                        if (!filteredGroupOrg){
                            toCreateGroup.push({
                                courseid: element, 
                                idnumber: `asdfqwe.org.${importanceDegreeOrganization[0].abbreviation.toLowerCase()}`, 
                                name: `asdfqwe.org.${importanceDegreeOrganization[0].abbreviation.toLowerCase()}`,
                                description: `asdfqwe.org.${importanceDegreeOrganization[0].abbreviation.toLowerCase()}`,
                                descriptionformat: 1,
                            })
                        }else{
                            toAssignGroup.push({
                                groupid: filteredGroupOrg.id,
                                userid: user.id!
                            })
                        }
                        if (!filteredGroupProg){
                            toCreateGroup.push({
                                courseid: element, 
                                idnumber: `asdfqwe.program.${enrollment.academic_program.abbreviation.toLowerCase()}`, 
                                name: `asdfqwe.program.${enrollment.academic_program.abbreviation.toLowerCase()}`,
                                description: `asdfqwe.program.${enrollment.academic_program.abbreviation.toLowerCase()}`,
                                descriptionformat: 1,
                            })
                        }else{
                            toAssignGroup.push({
                                groupid: filteredGroupProg.id,
                                userid: user.id!
                            })
                        }
                        await this.sleep(5000)
                        if (toCreateGroup.length > 0) {
                            const groups = await new GroupsManagerDatasourceImpl().createGroup(toCreateGroup, institutionMoodle)
                            console.log(groups);
                            
                            const filteredGroups = groups.map((e:any) => {
                                return {
                                    groupid: e.id,
                                    userid: user.id!
                                } as AddGroupInterface
                            })
                            toAssignGroup.push(...filteredGroups)
                        }

                        console.log(toAssignGroup);
                        

                        //
                        //if(toAssignGroup.length > 0) {
                        //    const response = await new GroupsManagerDatasourceImpl().assignGroup(toAssignGroup, institutionMoodle)
                        //    console.log(response.data);
                        //    
                        //}
                    
                    }
                }
            }
        }

    }

    async signUpDevelop(): Promise<void>{
        try {
            //codigo de obtencion de universidades por reglas de negocio
            const universities:DegreeDto[] = [
                {
                    active: true,
                    status: "Creada",
                    incidence: " - ",
                    abbreviation: "UNINIMX",
                    reference_id: 1498242
                },
                {
                    active: true,
                    status: "Creada",
                    incidence: " - ",
                    abbreviation: "UEA",
                    reference_id: 1498243
                }
            ];
            const modality = "virtual";
            let organization: OrganizationInterface | null = null;
            //obtienes las organizaciones que esten en degree por modalidad ordenado por importancia
            const organizations = await new OrganizationDatasourceImpl().getOrganizationsByImportance(universities.map(degree => degree.abbreviation), "virtual", true);
            if (modality === "virtual") {
                //si ecuentro UNIB en el listado este pasa a ser la organizacion principal
                const hasUnib = organizations.find(organization => organization.abbreviation === "UNIB");
                if (hasUnib) {organization = hasUnib};
                //si no encuentro UNIB en el listado busco al padre de la universidad principal
                if(organizations[0].parent){
                    const parent = await new OrganizationDatasourceImpl().getActiveById(organizations[0].parent);
                    if (parent) {organization = parent};
                }
            }
            
            console.log(organization);
        } catch (error) {
            console.log(error);
        }
    }
}