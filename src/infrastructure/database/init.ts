import { AddresseeMailSequelize } from "./models/AddresseeMailTable";
import { CampusSequelize } from "./models/Campus";
import { EventReceivingQueueSequelize } from "./models/EventReceivingQueue";
import { EventReceivingQueueLogSequelize } from "./models/EventReceivingQueueLog";
import { GroupDeletedNotificationSequelize } from "./models/GroupDeletedNotification";
import { InscriptionEventSequelize } from "./models/InscriptionEvent";
import { MoodleWsFunctionSequelize } from "./models/MoodleWsFunction";
import { OrganizationSequelize } from "./models/Organization";
import { RequestToMoodleLogSequelize } from "./models/RequestToMoodleLog";
import { StatusTransactionCatalogSequelize } from "./models/StatusTransactionCatalog";

export const DbSequelize = async (): Promise<void> => {
    try {
        //sync models with database

        await StatusTransactionCatalogSequelize.sync();
        await MoodleWsFunctionSequelize.sync();
        await OrganizationSequelize.sync();
        await RequestToMoodleLogSequelize.sync();
        await CampusSequelize.sync();
        await AddresseeMailSequelize.sync();
        await EventReceivingQueueSequelize.sync();
        await EventReceivingQueueLogSequelize.sync();
        await GroupDeletedNotificationSequelize.sync();
        await InscriptionEventSequelize.sync();
    } catch (error) {
        console.log(error)
        throw error;
    }
}
