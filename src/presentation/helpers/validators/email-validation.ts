import { InvalidParamError, MissingParamError } from "../../errors";
import { EmailValidator } from "../../protocols/email-validator";
import { Validation } from "../../protocols/validation";

export class EmailValidation implements Validation{

    constructor(private readonly field:string, private readonly validator: EmailValidator){
    }

    validate(input: any): Error {
        return !this.validator.isValid(input[this.field])?new InvalidParamError(input[this.field]):null
    }

}