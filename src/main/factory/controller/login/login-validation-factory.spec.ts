import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../../validation"
import { Validation } from "../../../../presentation/protocols/validation"
import { EmailValidator } from "../../../../validation/protocols/email-validator"
import { makeLoginValidation } from "./login-validation-factory"

jest.mock("../../../../validation/validation-composite")

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