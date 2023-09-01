import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "@/validation"
import { Validation } from "@/presentation/protocols"
import { EmailValidator } from "@/validation/protocols/email-validator"
import { makeLoginValidation } from "./login-validation-factory"
import {makeEmailValidator} from "@/validation/test";

jest.mock("../../../../../validation/validation-composite")

describe("SignUpValidationFactory", ()=>{
    test("Should call ValidationComposite with all validations", ()=>{



        const emailValidatorStub = makeEmailValidator()

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