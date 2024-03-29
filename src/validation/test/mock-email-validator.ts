import {EmailValidation} from "@/validation";
import {EmailValidator} from "@/validation/protocols/email-validator";

export const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub();
}