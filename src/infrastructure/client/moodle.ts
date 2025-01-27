import Enrollment from "@/domain/dtos/signUp/enrollment.dto";
import { AddGroupInterface, OrganizationInterface, UserInterface,GroupsInterface, EnrollmentMoodleInterface } from "../../shared/interfaces";
import { Axios } from "./axios";

export default class MoodleProvider {
    private axios: Axios;
    private organization: OrganizationInterface;

    constructor(
        organization: OrganizationInterface
    ){
        this.organization = organization;
        this.axios = Axios.getInstance(`${this.organization.origin}${this.organization.rest_path}`);
        
        this.axios.getAxiosInstance().defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    public async updateUser(user:UserInterface){        
        let basicBody = this.getBasicBody();
        basicBody.wsfunction = 'core_user_update_users';
        basicBody.users = [
            user
        ]
        return await this.axios.post(basicBody);
    }

    public async createUser(user:UserInterface){
        let basicBody = this.getBasicBody();
        basicBody.wsfunction = 'core_user_create_users';
        basicBody.users = [
            user
        ]
        return await this.axios.post(basicBody);
    }

    public async createGroup(groups:GroupsInterface[]){
        let basicBody = this.getBasicBody();
        basicBody.wsfunction = 'core_group_create_groups';
        basicBody.groups = groups;
        return await this.axios.post(basicBody);
    }

    public async assignGroup(addGroup:AddGroupInterface[]){
        let basicBody = this.getBasicBody();
        basicBody.wsfunction = 'core_group_add_group_members';
        basicBody.members = addGroup
        return await this.axios.post(basicBody);

    }

    public async enrollMasiveUserMoodle(enrollments: EnrollmentMoodleInterface[]){
        let basicBody = this.getBasicBody();
        basicBody.wsfunction = 'enrol_manual_enrol_users';
        basicBody.enrolments = enrollments;
        return await this.axios.post(basicBody);
    }

    public async unenrollMasiveUserMoodle(enrollments: EnrollmentMoodleInterface[]){
        let basicBody = this.getBasicBody();
        basicBody.wsfunction = 'enrol_manual_unenrol_users';
        basicBody.enrolments = enrollments;
        return await this.axios.post(basicBody);
    }

    public getBasicBody():{ [key: string]: any } {
        return {
            'moodlewsrestformat':'json',
            'wstoken':this.organization.token
        }
    }
}