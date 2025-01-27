import AcademicProgramDto from "@/domain/dtos/signUp/academicProgram.dto";
import GroupsManagerDatasource from "../../domain/datasource/group.datasource";
import { CustomError } from "../../shared/errors/custom.error";
import { GroupsInterface,GetGroupByNumberIdInterface, AddGroupInterface, OrganizationInterface } from "../../shared/interfaces";
import EducationalSyncProvider from "../client/educationalSync";
import MoodleProvider from "../client/moodle";

export default class GroupsManagerDatasourceImpl implements GroupsManagerDatasource {

    async assignGroup(addGroupInterface: AddGroupInterface[], organization: OrganizationInterface): Promise<any> {
        try {
            
            
            return new MoodleProvider(organization).assignGroup(addGroupInterface);

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }

    async createGroup(createGroupsInterface: GroupsInterface[], organization: OrganizationInterface): Promise<any> {
        try {

            const response: any = await new MoodleProvider(organization).createGroup(createGroupsInterface)
            console.log();
            
            return response;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }

    async getGroupById(courseId:any, organization: OrganizationInterface): Promise<GetGroupByNumberIdInterface[]> {
        try {

        const group: any = await new EducationalSyncProvider().getGroupById(courseId, organization);

        //if (group.data == null) return null;
        const groupExternal: any[] =  group.data;                        
            return groupExternal.map((group: any) => {return {
                id: group.id,
                externalId: group.externalId,
                idNumber: group.idNumber,
                name: group.name,
                description: group.description,
                courseId: group.courseId,
                createdAt: group.createdAt,
                updatedAt: group.updatedAt,
                deletedAt: group.deletedAt,
                } as GetGroupByNumberIdInterface});
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
}