export class MailerContentDto {
  constructor(
    public name: string,
    public abbreviation: string,
    public bodyHeader: string,
    public bodyDescription: string,
    public body: string | null,
    public bodyLastDescription: string,
  ){}

  static create(object: {[key: string]: any}): [string?, MailerContentDto?] {
    const { name, abbreviation, bodyHeader, bodyDescription, body, bodyLastDescription } = object;

    if(!object.name){
        return ['name is required'];
    }

    if(!object.abbreviation){
        return ['abbreviation is required'];
    }

    if(!object.bodyHeader){
        return ['bodyHeader is required'];
    }

    if(!object.bodyDescription){
        return ['bodyDescription is required'];
    }

    if(!object.bodyLastDescription){
        return ['bodyLastDescription is required'];
    }

    // Normalize strings without extra spaces
    object.bodyHeader = object.bodyHeader.trim().replace(/\s{2,}/g, ' ');
    object.bodyDescription = object.bodyDescription.trim().replace(/\s{2,}/g, ' ');
    object.body = object.body ? object.body.trim().replace(/\s{2,}/g, ' ') : null;
    object.bodyLastDescription = object.bodyLastDescription.trim().replace(/\s{2,}/g, ' ');
    
    return [undefined, new MailerContentDto(
        object.name,
        object.abbreviation,
        object.bodyHeader,
        object.bodyDescription,
        object.body,
        object.bodyLastDescription
    )]
  }
}