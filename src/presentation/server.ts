import DegreeDto from "../domain/dtos/signUp/degree.dto";
import { DbSequelize } from "../infrastructure/database/init";
import { Rabbitmq } from "../infrastructure/eventbus/rabbitmq";
import OrganizationDatasourceImpl from "../infrastructure/datasource/organization.datasource.impl";
import ProcessorDatasourceImpl from "../infrastructure/datasource/processor.datasource.impl";

export class Server {
    public async start(): Promise<void> {
        DbSequelize().then(async () => {
            //await Rabbitmq.init();
            console.log("Server started");
            await new ProcessorDatasourceImpl().signUpDevelop();
        }).catch((error) => {
            console.log(error);
        });
    }
}