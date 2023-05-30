import { Validation } from "../../protocols/validation";

export class ValidationComposite implements Validation{

    private readonly validators: Validation[]

    constructor(validators: Validation[]){
        this.validators = validators
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