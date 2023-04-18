import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-field-validation"
import { Validation } from "./validation"
import { ValidationComposite } from "./validation-composite"

const makeStub = ():Validation =>{
    class ValidationStub implements Validation{
        validate(input: any): Error {
            return new MissingParamError("any_field")
        }

    }

    return new ValidationStub()
}

describe("Composite Validation", ()=>{
    test("Should return Error when validation fails", ()=>{
        const stub = makeStub()

        const sut = new ValidationComposite([
            stub
        ])

        const err = sut.validate({field:"any_value"})

        expect(err).toEqual(new MissingParamError("any_field"))
    })

})