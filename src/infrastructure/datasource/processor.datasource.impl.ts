import { AddGroupInterface, GroupingsInterface, GroupsInterface, MapperAcademicElement, OrganizationInterface, UserInterface } from "../../shared/interfaces";
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
import ProgramMigrationDatasourceImpl from "./programMigration.datasource.impl";
import ProgramSpecialDatasourceImpl from "./programSpecial.datasource.impl";

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
                    uuids.push({ uuid: `${enrollment.academic_program.uuid}||${enrollment.academic_program.version}`, startedAt: new Date(enrollment.started_at).getTime() })
                    for (let i = 0; i < enrollment.academic_selections.length; i++) {
                        const element = enrollment.academic_selections[i];
                        const academicElemet = element.academic_element.filter((e: AcademicElementDto) => e.reference_class === "AsignaturaVersion")
                        if (academicElemet.length > 0) {
                            const uuidsAcademic = academicElemet.map((e: AcademicElementDto) => {
                                return {
                                    uuid: `${e.uuid}||${e.version}`,
                                    startedAt: new Date(inscription.started_at).getTime(),
                                    finishedAt: new Date(inscription.extension_finished_at).getTime()
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
            const signUp:SignUpDto = {"uuid":"6f3dcaa7-bf89-400c-ab15-793cb0c99a1a","student":{"city":"","dni":"PIGN980903MNLRRR00","uuid":"5894e467-3b87-5503-be41-d20cdfcbe836","email":"niria.priegogu@anahuac.mx","phone":"8116068863","address":"Guadalupe #1103, Col. Jardines del Santuario","country":"MX","language":"es","password":"5nrbOTNW1X","last_name":"Priego Guarneros","user_name":"MXSNMNAD5883642","created_at":"2025-01-08T14:15:21.920593Z","first_name":"Niria Lorelu","inscriptions":[{"uuid":"434d3bcd-8202-5e3c-8856-35d7cc8540db","active":1,"status":"Activo","degrees":[{"active":1,"status":"Creada","incidence":" - ","abbreviation":"UEA","reference_id":1513250}],"language":"es","modality":"VIRTUAL","incidence":"Al Día","created_at":"2025-01-08T14:15:21.910906Z","started_at":"2024-08-09T00:00:00.000000Z","enrollments":[{"uuid":"e9d0c3c1-792f-59bd-ab21-001c05c47345","language":"es","started_at":"2024-08-05T16:48:15.000000Z","reference_id":588634,"academic_term":{"started_at":"2024-08-09T00:00:00.000000Z","finished_at":"2026-08-09T00:00:00.000000Z","study_model":"_SEMESTRE","reference_id":1,"school_period":"Funiber"},"academic_program":{"name":"Maestría en Actividad Física orientada a la Mujer","type":"Program","uuid":"9ac081eb-8041-5cb6-82b0-2a5c565247ec","version":"2024-TFC","language":"es","abbreviation":"DPMAFM","is_scheduled":0,"reference_id":1510},"academic_selections":[{"uuid":"b10873c4-4938-59d9-8175-6b2f3f4b290b","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992166,"academic_element":[{"name":"Estructura y Función del Cuerpo Humano","type":"Subject","uuid":"2632b229-3fef-5814-b9ad-c233f2ebec07","version":"SN039-vEA","language":null,"abbreviation":"SN039","reference_id":279532,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"1550f882-7351-54e3-92d1-a25b271c5732","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992167,"academic_element":[{"name":"Contextualización de la actividad física y el ejercicio en el marco de la salud","type":"Subject","uuid":"80c281fa-b339-5d45-89ee-41ea82498fc0","version":"SN155-vEA","language":null,"abbreviation":"SN155","reference_id":279546,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"1539cc88-e9f3-5482-a8b3-50b30b73daa8","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992168,"academic_element":[{"name":"Valoración de la condición física","type":"Subject","uuid":"8b4a99fe-f68a-517b-aba1-4aca3a11b186","version":"CDS104-vEA","language":null,"abbreviation":"CDS104","reference_id":279561,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"d20ef46c-2387-510b-95dd-948c40f8e5d2","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992169,"academic_element":[{"name":"Valoración del estado nutricional en embarazadas, niños y adolescentes","type":"Subject","uuid":"63fdfdf8-2510-585c-aa06-252ddc227838","version":"SN367-vEA","language":null,"abbreviation":"SN367","reference_id":279575,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"57aac86d-9cbb-5319-9db1-acadca9ce353","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992170,"academic_element":[{"name":"Evaluación del estado nutricional del deportista","type":"Subject","uuid":"ee486c0d-e5d0-5e4e-96d9-8e2f17e34e85","version":"SN325-vEA","language":null,"abbreviation":"SN325","reference_id":279589,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"d3347ff1-493c-590b-bdad-0afb52f6f402","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992171,"academic_element":[{"name":"Actividad física en la mujer","type":"Subject","uuid":"499a06ed-c97b-533e-a1cd-ea91bc1da040","version":"DP020-vEA","language":null,"abbreviation":"DP020","reference_id":279618,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"083a25e2-fefc-50ae-aad9-da88fef5e4e6","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992172,"academic_element":[{"name":"Influencia del ciclo menstrual en la práctica de la actividad física","type":"Subject","uuid":"399746f2-2610-5a0b-ad9c-ed2201df6537","version":"DP054-vEA","language":null,"abbreviation":"DP054","reference_id":279632,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"a40b7cdb-3dec-5e14-99ef-aa51eeffe264","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992173,"academic_element":[{"name":"Actividad física durante el Embarazo y periodo postparto","type":"Subject","uuid":"3d2652f3-1fd2-5cd1-a562-c713094877ca","version":"DP055-vEA","language":null,"abbreviation":"DP055","reference_id":279646,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"71fa454d-e3b5-54e2-8813-08ac21e4fa7b","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992174,"academic_element":[{"name":"Patologías comunes y actividad física en la Mujer","type":"Subject","uuid":"bdde2fc6-fa7c-58ad-b942-cee67194c2d3","version":"DP056-vEA","language":null,"abbreviation":"DP056","reference_id":279604,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"153f43f0-974f-5162-932b-7a3712d0b24a","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992175,"academic_element":[{"name":"El proceso de investigación en el ámbito de la Actividad Física y el Deporte","type":"Subject","uuid":"a929df5c-ceff-5883-8b57-23e368cc41e4","version":"DP2551-vEA","language":null,"abbreviation":"DP2551","reference_id":279764,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"7e5ccf2e-0ccb-51d5-9e7d-694ed5dba5a2","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992176,"academic_element":[{"name":"Lesiones deportivas en la mujer","type":"Subject","uuid":"dcd07d86-4895-5915-ac4b-fc3b8ffc34f7","version":"DP057-vEA","language":null,"abbreviation":"DP057","reference_id":279690,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"8413672c-e3f0-589a-9d44-df51a353ba27","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992177,"academic_element":[{"name":"Mujer y rendimiento deportivo","type":"Subject","uuid":"bc8a3252-e6ae-5e1d-b1f9-cff779b6027e","version":"DP058-vEA","language":null,"abbreviation":"DP058","reference_id":279704,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]},{"uuid":"36b9f48d-f136-57b1-97b0-075079b4b132","started_at":"2024-08-05T00:00:00.000000Z","admission_id":290618,"reference_id":992178,"academic_element":[{"name":"Tendencias de entrenamiento en la mujer","type":"Subject","uuid":"f4647adf-9e6f-549f-92db-e994453a3bc2","version":"DP059-vEA","language":null,"abbreviation":"DP059","reference_id":279718,"reference_type":"_OBLIGATORIO","reference_class":"AsignaturaVersion"}]}]}],"finished_at":"2026-08-09T00:00:00.000000Z","reference_id":285418,"registered_at":"2024-07-31T00:00:00.000000Z","academic_program":{"name":"Maestría en Actividad Física orientada a la Mujer","type":"Program","uuid":"9ac081eb-8041-5cb6-82b0-2a5c565247ec","version":"2023","language":"es","abbreviation":"DDNGI","is_scheduled":0,"reference_id":1510},"introductory_module":[],"extension_finished_at":"2026-08-09T00:00:00.000000Z","institution_abbreviation":"FBR"}],"reference_id":5883642,"institution_abbreviation":"FBR"},"fired_at":"2025-01-08T15:42:03.762271Z"}
            for (let i = 0; i < signUp.student.inscriptions.length; i++) {
                const element = signUp.student.inscriptions[i];
                const organization = await new OrganizationDatasourceImpl().getSignUpOrganization(element)
                console.log(organization);
                
            }
        } catch (error) {
            console.log(error);
        }
    }
}