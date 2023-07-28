import { EmailValidatorAdapter } from "../../../../infra/validator/email-validator-adapter";
import { CompareFieldsValidation, RequiredFieldValidation, EmailValidation, ValidationComposite } from "../../../../validation";
import { Validation } from "../../../../presentation/protocols/validation";

export const makeSignUpValidation = (): Validation => {
    const emailValidatorAdapter = new EmailValidatorAdapter()

    const validationComposite = new ValidationComposite(
        [
            new RequiredFieldValidation("name"),
            new RequiredFieldValidation("email"),
            new RequiredFieldValidation("password"),
            new RequiredFieldValidation("passwordConfirmation"),
            new CompareFieldsValidation("password", "passwordConfirmation"),
            new EmailValidation("email", emailValidatorAdapter)
    ]
    )

    return validationComposite;
}