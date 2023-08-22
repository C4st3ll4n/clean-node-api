import { InvalidParamError } from "@/presentation/errors";
import { Validation } from "@/presentation/protocols";
import { EmailValidator } from "./protocols/email-validator";

export class EmailValidation implements Validation{

    constructor(private readonly field:string, private readonly validator: EmailValidator){
    }

    validate(input: any): Error {
        return !this.validator.isValid(input[this.field])?new InvalidParamError(input[this.field]):null
    }

}