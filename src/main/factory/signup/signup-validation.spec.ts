import { CompareFieldsValidation } from "../../../presentation/helpers/validators/compare-fields-validation"
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation"
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation"
import { Validation } from "../../../presentation/helpers/validators/validation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite"
import { EmailValidator } from "../../../presentation/protocols/email-validator"
import { makeSignUpValidation } from "./signup-validation"

jest.mock("../../../presentation/helpers/validators/validation-composite")

describe("SignUpValidationFactory", ()=>{
    test("Should call ValidationComposite with all validations", ()=>{

        class EmailValidatorStub implements EmailValidator{
            isValid(email: string): boolean {
                return true
            }
        }

        const emailValidatorStub = new EmailValidatorStub()

        makeSignUpValidation()
        const fields = ['name', 'email', 'password', 'passwordConfirmation']

        const validations: Validation[] = []

        for(const f of fields){
            validations.push(new RequiredFieldValidation(f))
        }

        validations.push(
            new CompareFieldsValidation("password", "passwordConfirmation")
        )

        validations.push(
            new EmailValidation("email", emailValidatorStub)
        )
        
        expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
    })
})