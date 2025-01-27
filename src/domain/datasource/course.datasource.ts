export default abstract class CourseDatasource {
    abstract getCoursesByInstitutionAbbrAndModality(uuids: string[] ,institutionAbbr: string, modality: string): Promise<any>
}