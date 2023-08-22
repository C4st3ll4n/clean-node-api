import { Validation } from "@/presentation/protocols";
import { RequiredFieldValidation, ValidationComposite } from "@/validation";

export const makeCreateSurveyValidation = (): Validation => {
    const validationComposite = new ValidationComposite(
        [
            new RequiredFieldValidation("question"),
            new RequiredFieldValidation("answers")
        ]
    )

    return validationComposite;
}