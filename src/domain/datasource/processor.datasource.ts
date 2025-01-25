export default abstract class ProcessorDatasource {
    abstract signUp(payload: Object): Promise<void>
}