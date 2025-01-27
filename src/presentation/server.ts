import DegreeDto from "../domain/dtos/signUp/degree.dto";
import { DbSequelize } from "../infrastructure/database/init";
import { Rabbitmq } from "../infrastructure/eventbus/rabbitmq";
import OrganizationDatasourceImpl from "../infrastructure/datasource/organization.datasource.impl";
import { OrganizationInterface } from "@/shared/interfaces";

export class Server {
    public async start(): Promise<void> {
        DbSequelize().then(async () => {
            //await Rabbitmq.init();
            console.log("Server started");
        }).catch((error) => {
            console.log(error);
        });
    }
}