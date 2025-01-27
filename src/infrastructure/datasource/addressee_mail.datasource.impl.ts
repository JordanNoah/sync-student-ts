import AddresseeMailDatasource from "../../domain/datasource/addressee_mail.datasource";
import AddresseeMailDto from "../../domain/dtos/internal/addressee_mail.dto";
import { CustomError } from "../../shared/errors/custom.error";
import { AddresseeMailnterface } from "../../shared/interfaces";
import { AddresseeMailSequelize } from "../database/models/AddresseeMailTable";

export default class AddresseeMailDatasourceImpl extends AddresseeMailDatasource {
    async createAddresseeMail(AddresseeMailDto: AddresseeMailDto): Promise<AddresseeMailnterface> {
        try {
            const [addresseeMail, created] = await AddresseeMailSequelize.findOrCreate({
                where: {
                  email: AddresseeMailDto.email
                },
                defaults: {
                  reason: AddresseeMailDto.reason,
                  email: AddresseeMailDto.email,
                  params: AddresseeMailDto.params ? AddresseeMailDto.params: null,
                  activate: AddresseeMailDto.activate
                }
              });
              return {
                id: addresseeMail.id,
                reason: addresseeMail.reason,
                email: addresseeMail.email,
                params: addresseeMail.params,
                activate: addresseeMail.activate,
                createdAt: addresseeMail.createdAt,
                updatedAt: addresseeMail.updatedAt,
                deletedAt: addresseeMail.deletedAt
              };
        } catch (error) {
            console.log(error);
            
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalSever();
        }
    }
}