import { FieldDto } from "./field.dto";
import { PropertiesDto } from "./properties.dto";

export class EventDto {
    private constructor(
        public fields: FieldDto,
        public properties: PropertiesDto,
        public content: any
    ){}

    static create(object:{[key:string]:any}):[string?,EventDto?]{
        const {
            fields,
            properties,
            content
        } = object

        return [
            undefined,
            new EventDto(
                fields,
                properties,
                content.toString()
            )
        ]
    }
}