import { Validation } from "../../../../../presentation/protocols";
import { RequiredFieldValidation, ValidationComposite } from "../../../../../validation";
import {makeCreateSurveyValidation} from "./create-survey-validation-factory";
jest.mock("../../../../../validation/validation-composite")

describe("CreateSurveyValidation Factory", ()=>{
    test("Should call ValidationComposite with all validations", ()=>{
        makeCreateSurveyValidation()

        const validations:Validation[] = []
        for(const f of ['question', 'answers']){
            validations.push(new RequiredFieldValidation(f))
        }

        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})