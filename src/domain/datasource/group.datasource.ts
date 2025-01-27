import { GroupsInterface, AddGroupInterface, OrganizationInterface} from "../../shared/interfaces";
import AcademicProgramDto from "../dtos/signUp/academicProgram.dto";

export default abstract class GroupsManagerDatasource {
    abstract createGroup(createGroupsInterface: GroupsInterface[], organization: OrganizationInterface): Promise<any>;
    abstract assignGroup(addGroupInterface: AddGroupInterface[], organization: OrganizationInterface): Promise<any>;
}