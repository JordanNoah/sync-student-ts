import { HeadersDto } from "./header.dto";

export class PropertiesDto {
    private constructor(
        public contentType: string,
        public contentEncoding: string | undefined,
        public headers: HeadersDto,
        public deliveryMode: number | undefined,
        public priority: number | undefined,
        public correlationId: number | undefined,
        public replyTo: number | undefined,
        public expiration: number | undefined,
        public messageId: string | undefined,
        public timestamp: number,
        public type: string,
        public userId: number | undefined,
        public appId: string,
        public clusterId: number | undefined
    ){}
}