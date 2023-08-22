import {EmailValidatorAdapter} from "@/infra/validator/email-validator-adapter";
import {CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite} from "@/validation";
import {Validation} from "@/presentation/protocols";

export const makeSignUpValidation = (): Validation => {
    const emailValidatorAdapter = new EmailValidatorAdapter()

    return new ValidationComposite(
        [
            new RequiredFieldValidation("name"),
            new RequiredFieldValidation("email"),
            new RequiredFieldValidation("password"),
            new RequiredFieldValidation("passwordConfirmation"),
            new CompareFieldsValidation("password", "passwordConfirmation"),
            new EmailValidation("email", emailValidatorAdapter)
        ]
    );
}