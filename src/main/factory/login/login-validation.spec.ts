import { CompareFieldsValidation } from "../../../presentation/helpers/validators/compare-fields-validation"
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation"
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation"
import { Validation } from "../../../presentation/protocols/validation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite"
import { EmailValidator } from "../../../presentation/protocols/email-validator"
import { makeLoginValidation } from "./login-validation"

jest.mock("../../../presentation/helpers/validators/validation-composite")

describe("SignUpValidationFactory", ()=>{
    test("Should call ValidationComposite with all validations", ()=>{

        class EmailValidatorStub implements EmailValidator{
            isValid(email: string): boolean {
                return true
            }
        }

        const emailValidatorStub = new EmailValidatorStub()

        makeLoginValidation()
        const fields = ['email', 'password']

        const validations: Validation[] = []

        for(const f of fields){
            validations.push(new RequiredFieldValidation(f))
        }

        validations.push(
            new EmailValidation("email", emailValidatorStub)
        )
        
        expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
    })
})