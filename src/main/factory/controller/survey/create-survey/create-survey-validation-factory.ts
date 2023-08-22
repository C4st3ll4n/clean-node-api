import {Validation} from "@/presentation/protocols";
import {RequiredFieldValidation, ValidationComposite} from "@/validation";

export const makeCreateSurveyValidation = (): Validation => {
    return new ValidationComposite(
        [
            new RequiredFieldValidation("question"),
            new RequiredFieldValidation("answers")
        ]
    );
}