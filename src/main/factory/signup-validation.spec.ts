import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation"
import { Validation } from "../../presentation/helpers/validators/validation"
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite"
import { makeSignUpValidation } from "./signup-validation"

jest.mock("../../presentation/helpers/validators/validation-composite")

describe("SignUpValidationFactory", ()=>{
    test("Should call ValidationComposite with all validations", ()=>{
        makeSignUpValidation()
        const fields = ['name', 'email', 'password', 'passwordConfirmation']

        const validations: Validation[] = []

        for(const f of fields){
            validations.push(new RequiredFieldValidation(f))
        }
        
        expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
    })
})