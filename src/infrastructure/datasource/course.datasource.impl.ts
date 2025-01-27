import { ExistingCourseInterface } from "@/shared/interfaces";
import CourseDatasource from "../../domain/datasource/course.datasource";
import { CustomError } from "../../shared/errors/custom.error";
import EducationalSyncProvider from "../client/educationalSync";

export default class CourseDatasourceImpl extends CourseDatasource {
    async getCoursesByInstitutionAbbrAndModality(uuids: string[], institutionAbbr: string, modality: string): Promise<ExistingCourseInterface> {
        try {
            // Call to moodle to get courses
            const courses = await new EducationalSyncProvider().findCoursesByUuids(uuids, institutionAbbr, modality);            
            return courses.data;
        } catch (error) {
            console.log(error);
            
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
}