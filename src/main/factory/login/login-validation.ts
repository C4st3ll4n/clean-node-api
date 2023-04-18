import { CompareFieldsValidation } from "../../../presentation/helpers/validators/compare-fields-validation";
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
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