import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../presentation/helpers/validators/";
import { Validation } from "../../../presentation/protocols/validation";
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";

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