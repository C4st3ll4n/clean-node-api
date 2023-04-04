import { InvalidParamError, MissingParamError } from "../../errors";
import { EmailValidator } from "../../protocols/email-validator";
import { Validation } from "./validation";

export class EmailValidation implements Validation{
    private readonly fieldName: string
    private readonly emailValidator: EmailValidator

    constructor(field:string, validator: EmailValidator){
        this.fieldName = field
        this.emailValidator = validator
    }

    validate(input: any): Error {
        return !this.emailValidator.isValid(input[this.fieldName])?new InvalidParamError(input[this.fieldName]):null
    }

}