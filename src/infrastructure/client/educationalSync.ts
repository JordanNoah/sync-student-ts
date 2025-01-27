import { Axios } from "./axios";
import AppConfig from "../../shared/config";
import { OrganizationInterface } from "@/shared/interfaces";

export default class EducationalSyncProvider {
    private axios: Axios;
    
    constructor(){
        this.axios = Axios.getInstance(AppConfig.EDUCATIONALSYN_URL);
    }

    public async getUserByUsernameAndInstitution(username:string, institutionAbb: string, modality: string): Promise<any> {
        return await this.axios.get(`/user/username-institutionabbr`,{
            params:{
                username:username,
                institutionAbbr: institutionAbb,
                modality: modality
            }
        });
    }

    public async getEnrollmentsByUserId(userId: number, institutionAbbr:string, institutionModality:string): Promise<any> {
        const query = new URLSearchParams();
        query.append("userId", userId.toString());
        query.append("institutionAbbr", institutionAbbr);
        query.append("institutionModality", institutionModality);
        
        return await this.axios.get(`/enrollment`,{
            params: query
        });
    }


    public async getGroupById(courseId:number, organization: OrganizationInterface): Promise<any> {
        const query = new URLSearchParams();
        query.append("courseId", courseId.toString());
        query.append("institutionAbbr", organization.abbreviation);
        query.append("modality", organization.modality!);

        return await this.axios.get(`/group/courseId`,{
            params:query
        });
    }

    public async findCoursesByUuids(uuids: string[], institutionAbbr: string, modality: string): Promise<any> {
        const query = new URLSearchParams();
        query.append("idNumbers",uuids.toString())
        query.append("institutionAbbr", institutionAbbr)
        query.append("modality", modality)
        return await this.axios.get(`/course/idNumbers-institution`,{
            params: query
        })
    }
}