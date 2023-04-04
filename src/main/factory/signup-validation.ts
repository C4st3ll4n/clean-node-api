import { CompareFieldsValidation } from "../../presentation/helpers/validators/compare-fields-validation";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";

export const makeSignUpValidation = (): Validation => {

    const validationComposite = new ValidationComposite(
        [
            new RequiredFieldValidation("name"),
            new RequiredFieldValidation("email"),
            new RequiredFieldValidation("password"),
            new RequiredFieldValidation("passwordConfirmation"),
            new CompareFieldsValidation("password", "passwordConfirmation")
    ]
    )

    return validationComposite;
}