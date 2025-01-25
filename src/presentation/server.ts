import { DbSequelize } from "../infrastructure/database/init";
import { Rabbitmq } from "../infrastructure/eventbus/rabbitmq";

export class Server {
    public async start(): Promise<void> {
        DbSequelize().then(async () => {
            await Rabbitmq.init();
            console.log("Server started");
        }).catch((error) => {
            console.log(error);
        });
    }
}