import { AddresseeMailnterface } from "@/shared/interfaces";
import AddresseeMailDto from "../dtos/internal/addressee_mail.dto";

export default abstract class AddresseeMailDatasource {
    abstract createAddresseeMail(addresseeMailDto: AddresseeMailDto): Promise<AddresseeMailnterface>
    // abstract getAddresseeMail(modality: string, abbreviation:string): Promise<AddresseeMailnterface | null>
}