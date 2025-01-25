import ProcessorDatasource from "../../domain/datasource/processor.datasource";
import SignUpDto from "../../domain/dtos/signUp/signUp.dto";

export default class ProcessorDatasourceImpl implements ProcessorDatasource {
    async signUp(payload: Object): Promise<void> {
        const [errorSigUp, signUpDto] = SignUpDto.create(payload);
            if (errorSigUp){
                if (errorSigUp.errorAbbreviation === "ACADEMICELEMENT_NAME_REQUIRED"){
                    console.log("enviar correo a configuracion_campus");
                }else{
                    console.log(JSON.stringify(payload));
                    
                    console.log(errorSigUp);
                }
                
            }
    }
}