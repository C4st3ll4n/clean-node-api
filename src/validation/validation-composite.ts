import { Validation } from "../presentation/protocols"

export class ValidationComposite implements Validation{

    constructor(private readonly validators: Validation[]){
    }

    validate(input: any): Error {
        for(const validator of this.validators){
            const err = validator.validate(input)
            if(err){
                return err
            }
        }
    }

}