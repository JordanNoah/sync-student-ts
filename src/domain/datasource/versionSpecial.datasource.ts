import { VersionSpecialInterface } from "@/shared/interfaces";

export default abstract class VersionSpecialDatasource {
    abstract createVersionSpecial(version:string, programSpecialId:number ,params?: string): Promise<VersionSpecialInterface>
    abstract getVersionsByProgramId(programId: number): Promise<VersionSpecialInterface[]>
}