import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../../presentation/helpers/validators"
import { Validation } from "../../../../presentation/protocols/validation"
import { EmailValidator } from "../../../../presentation/protocols/email-validator"
import { makeSignUpValidation } from "./signup-validation-factory"

jest.mock("../../../../presentation/helpers/validators/validation-composite")

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