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
            const signUp:SignUpDto = {"uuid": "4c97d535-2309-4346-8221-7753f842bac6", "student": {"dni": "031702000267S", "city": "Nacala-Porto", "uuid": "fc2e9841-2cac-563d-a239-17760c7ad0f3", "email": "pintoferabudo@gmail.com", "phone": "847096987", "address": "Tete", "country": "MZ", "language": "pt", "password": "LJPIaEjC3W", "last_name": "Abudo", "user_name": "MZIPMII5256098", "created_at": "2025-01-17T05:55:35.629407Z", "first_name": "Pinto Fernando", "inscriptions": [{"uuid": "21fd6f76-6a42-558d-be4b-bab90b7544e3", "active": 1, "status": "Activo", "degrees": [{"active": 1, "status": "Creada", "incidence": " - ", "abbreviation": "UEA", "reference_id": 1518125}], "language": "pt", "modality": "VIRTUAL", "incidence": "Al Día", "created_at": "2025-01-17T05:55:35.621097Z", "started_at": "2024-10-15T00:00:00.000000Z", "enrollments": [{"uuid": "e9796b58-551f-5188-aa9d-2f4e978929ab", "language": "pt", "started_at": "2024-10-15T13:40:47.000000Z", "reference_id": 592693, "academic_term": {"started_at": "2024-10-15T00:00:00.000000Z", "finished_at": "2026-10-15T00:00:00.000000Z", "study_model": "_SEMESTRE", "reference_id": 1, "school_period": "Funiber"}, "academic_program": {"name": "Máster en Organización de Empresas y Proyectos Industriales", "type": "Program", "uuid": "013ad1c5-3963-58cd-be95-5e2f0a063ec6", "version": "2018-vEA-TFC", "language": "pt", "abbreviation": "IPMII", "is_scheduled": 0, "reference_id": 1095}, "academic_selections": [{"uuid": "2fe947d6-0e4a-596f-bf0d-e6f9a483b272", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071948, "academic_element": [{"name": "Gestión y Dirección de Operaciones", "type": "Subject", "uuid": "4020014f-4a44-5c6e-addc-545acded1e2a", "version": "DD012-vEA", "language": null, "abbreviation": "DD012", "reference_id": 106827, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "27045131-b7ae-56c2-a71b-6a431770ff09", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071949, "academic_element": [{"name": "Ingeniería de Procesos Industriales", "type": "Subject", "uuid": "3fd751c7-4811-5484-9872-bdc735b15249", "version": "IP2577-vEA", "language": null, "abbreviation": "IP2577", "reference_id": 106841, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "e0adf3db-747f-5f3d-998d-521c3d3c1651", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071950, "academic_element": [{"name": "Gestión de la calidad: ISO 9001 y auditoría", "type": "Subject", "uuid": "afe5337d-54fb-5cad-86ff-4fb8b673c767", "version": "DD132-vEA", "language": null, "abbreviation": "DD132", "reference_id": 106855, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "1e457bce-d06a-5358-8952-a03e1b5589b5", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071951, "academic_element": [{"name": "ISO 45001", "type": "Subject", "uuid": "debb131c-5a8e-5204-b2aa-98f56bf030ae", "version": "IP092-vEA", "language": null, "abbreviation": "IP092", "reference_id": 106869, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "16272e25-cd34-59be-a3b2-fa3e5a31a879", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071952, "academic_element": [{"name": "Gestión Ambiental de la Empresa: ISO 14001", "type": "Subject", "uuid": "0f6e71ef-6952-5f1c-a7ce-3e8a132249b0", "version": "MA098-vEA", "language": null, "abbreviation": "MA098", "reference_id": 106883, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "e46be1d5-4ac1-54d0-bfe9-62feb72fd9d1", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071953, "academic_element": [{"name": "Los sistemas de Gestión Integrada: Calidad, Medio ambiente y Prevención", "type": "Subject", "uuid": "3866f79c-dcb7-5641-a3e4-789ef26e0997", "version": "IP084-vEA", "language": null, "abbreviation": "IP084", "reference_id": 106897, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "29532bcb-a24c-5d83-9b5a-17d4c15c8929", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071954, "academic_element": [{"name": "Integración de los Sistemas de Gestión Empresarial", "type": "Subject", "uuid": "1c7505bd-6df9-501b-9ddb-cff1708bafbe", "version": "TI017-vEA", "language": null, "abbreviation": "TI017", "reference_id": 106911, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "d534aaab-0afd-5d68-a630-acff79812c2a", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071955, "academic_element": [{"name": "Planificación y Gestión de Proyectos", "type": "Subject", "uuid": "0368e020-8e88-50da-b81e-f3f2fe9c78c4", "version": "TR038-vEA", "language": null, "abbreviation": "TR038", "reference_id": 106925, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "41171729-3290-5089-8eef-3c7a1320d76d", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071956, "academic_element": [{"name": "Evaluación de Proyectos", "type": "Subject", "uuid": "b8c9cf4c-8fee-5227-b841-8c794477d2ce", "version": "DD074-vEA", "language": null, "abbreviation": "DD074", "reference_id": 106939, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "533ee23b-7d30-5b05-bb84-46a93e2a6223", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071957, "academic_element": [{"name": "Técnicas de Dirección y Liderazgo Organizacional", "type": "Subject", "uuid": "98454e37-cda0-5451-8fa8-7fb9ae8cb130", "version": "TR024-vEA", "language": null, "abbreviation": "TR024", "reference_id": 106953, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "a45e4e26-f7a1-5165-99cb-1bed96253ca2", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071958, "academic_element": [{"name": "Gestión Estratégica de los Recursos Humanos", "type": "Subject", "uuid": "12c092c6-9524-5ce9-9acf-725e8ab81166", "version": "TR046-vEA", "language": null, "abbreviation": "TR046", "reference_id": 106967, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "ce4236d8-0f37-58fd-865f-142dbf7da44c", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071959, "academic_element": [{"name": "Resolución/Transformación de conflictos en el ámbito organizacional", "type": "Subject", "uuid": "b0e2bd46-070a-554b-a68e-f218e5bc3c2a", "version": "DD103-vEA", "language": null, "abbreviation": "DD103", "reference_id": 106981, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}, {"uuid": "9888bd71-fb05-5045-b730-f93d83f9b503", "started_at": "2024-10-15T00:00:00.000000Z", "admission_id": 294937, "reference_id": 1071960, "academic_element": [{"name": "Seminario de Investigación I", "type": "Subject", "uuid": "f240c9b5-be61-5c10-9538-45e04de552ef", "version": "IP2797-vEA", "language": null, "abbreviation": "IP2797", "reference_id": 106995, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}]}], "finished_at": "2026-10-15T00:00:00.000000Z", "reference_id": 289477, "registered_at": "2024-10-15T00:00:00.000000Z", "academic_program": {"name": "Máster en Organización de Empresas y Proyectos Industriales", "type": "Program", "uuid": "013ad1c5-3963-58cd-be95-5e2f0a063ec6", "version": "2018-vEA-TFC", "language": "pt", "abbreviation": "IPMII", "is_scheduled": 0, "reference_id": 1095}, "introductory_module": [{"name": "Curso de Inducción", "type": "Program", "uuid": "31d517f9-8b06-5e2b-8718-b5f2e7f71f34", "version": "2023", "abbreviation": "INDNC", "reference_id": 1857, "academic_element": [{"name": "Curso de Inducción", "type": "Subject", "uuid": "af2cbb48-c2e7-52dd-b9ed-bb4dfe793435", "version": "INDNC-vEA", "language": null, "abbreviation": "INDNC", "reference_id": 273167, "reference_type": "_OBLIGATORIO", "reference_class": "AsignaturaVersion"}]}], "extension_finished_at": "2026-10-15T00:00:00.000000Z", "institution_abbreviation": "FBR"}], "reference_id": 5256098, "institution_abbreviation": "FBR"}, "fired_at": "2025-01-27T16:03:04.162021Z"}
            for (let i = 0; i < signUp.student.inscriptions.length; i++) {
                const element = signUp.student.inscriptions[i];
                const modality = element.modality;

                let organization: OrganizationInterface | null = null;
                //obtienes las organizaciones que esten en degree por modalidad ordenado por importancia
                const organizations = await new OrganizationDatasourceImpl().getOrganizationsByImportance(element.degrees.map(degree => degree.abbreviation), "virtual", true);
                if (modality.toLowerCase() === "virtual") {
                    //si ecuentro UNIB en el listado este pasa a ser la organizacion principal
                    const hasUnib = organizations.find(organization => organization.abbreviation === "UNIB");
                    if (hasUnib) {organization = hasUnib};
                    //si no encuentro UNIB en el listado busco al padre de la universidad principal
                    if(organizations[0].parent){
                        const parent = await new OrganizationDatasourceImpl().getActiveById(organizations[0].parent);
                        if (parent) {organization = parent};
                    }
                    // validamos el programa sea migrado sino ignoramos el proceso
                    const programMigrated = await new ProgramMigrationDatasourceImpl().getMigratedProgram(element.academic_program.abbreviation);
                    //todo fix this
                    if(!programMigrated) throw new Error("Program not found");
                    
                    //una vez se encuentra que el programa esta migrado se revisa si la version esta migrada
                    const versionMigrated = programMigrated.versions.find((version) => version.version === element.academic_program.version)
                    if(!versionMigrated) throw new Error("Version not found");
                    
                    if (element.academic_program.is_scheduled) {
                        //si es calendarizado
                    } else if (element.academic_program.abbreviation == "fi") {
                        //si es fi para pasarlo a la organizacion de TODO
                    } else{
                        //revisar si la fecha de registro es mayor > a 2024
                        if (!(new Date(element.registered_at).getFullYear() >= 2024)){
                            //revisar si es prorroga especial
                        }                        
                    }
                    
                }

                //console.log(organization);
            }
        } catch (error) {
            console.log(error);
        }
    }
}