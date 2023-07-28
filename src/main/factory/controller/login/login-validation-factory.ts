import { EmailValidatorAdapter } from "../../../../infra/validator/email-validator-adapter";
import { Validation } from "../../../../presentation/protocols/validation";
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../../validation";

export const makeLoginValidation = (): Validation => {
    const emailValidatorAdapter = new EmailValidatorAdapter()

    const validationComposite = new ValidationComposite(
        [
            new RequiredFieldValidation("email"),
            new RequiredFieldValidation("password"),
            new EmailValidation("email", emailValidatorAdapter)
        ]
    )

    return validationComposite;
}