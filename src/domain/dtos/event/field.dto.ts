export class FieldDto {
    private constructor(
        public consumerTag: string,
        public deliveryTag: number,
        public redelivered: boolean,
        public exchange: string,
        public routingKey: string
    ){}
}