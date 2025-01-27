export default class AddresseeMailDto {
    constructor(
        public id: number,
        public reason: string,
        public email: string,
        public params: string | null,
        public activate: boolean,
        public createdAt?: Date,
        public updatedAt?: Date,
        public deletedAt?: Date | null,
    ){}
static create(object: { [key: string]: any }):[string?, AddresseeMailDto?]{
        return [
            undefined,
            new AddresseeMailDto(
                object.id,
                object.reason,
                object.email,
                object.params,
                object.actrivate,
                object.created_at,
                object.updatedAt,
                object.deletedAt,
            )
        ]
    }
}