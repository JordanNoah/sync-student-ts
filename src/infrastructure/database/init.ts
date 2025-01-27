import { OrganizationSeederExec } from "./migration/exec/organization.exec.seeder";
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
import { MailerTemplateSeederExec } from "./migration/exec/mailerTemplate.exec.seeder";
import { MailerTemplateSequelize } from "./models/MailerTemplate";
import { MailerContentSequelize } from "./models/MailerContent";
import { MailerContentSeederExec } from "./migration/exec/mailerContent.exec.seeder";
import { MailerNotificationSequelize } from "./models/MailerNotification";
import { MailerNotificationSeederExec } from "./migration/exec/mailerNotification.exec.seeder";
import { MailerTemplateContentSequelize } from "./models/MailerTemplateContent";
import { MailerTemplateContentSeederExec } from "./migration/exec/mailerTemplateContent.exec.seeder";

export const DbSequelize = async (): Promise<void> => {
    try {
        //sync models with database

        await StatusTransactionCatalogSequelize.sync();
        await MoodleWsFunctionSequelize.sync();
        await OrganizationSequelize.sync();
        await CampusSequelize.sync();
        await AddresseeMailSequelize.sync();
        await EventReceivingQueueSequelize.sync();
        await EventReceivingQueueLogSequelize.sync();
        await RequestToMoodleLogSequelize.sync();
        await GroupDeletedNotificationSequelize.sync();
        await InscriptionEventSequelize.sync();
        await MailerTemplateSequelize.sync()
        await MailerContentSequelize.sync();
        await MailerNotificationSequelize.sync();
        await MailerTemplateContentSequelize.sync();

        await new OrganizationSeederExec().up();
        await new MailerTemplateSeederExec().up();
        await new MailerContentSeederExec().up();
        await new MailerNotificationSeederExec().up();
        await new MailerTemplateContentSeederExec().up();
    } catch (error) {
        throw error;
    }
}
