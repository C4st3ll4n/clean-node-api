import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-field-validation"

describe("Required Field Validation", ()=>{
    test("Should return MissingParamError when validation fails", ()=>{
        const sut = new RequiredFieldValidation("any_field")

        const err = sut.validate({name:"any_name"})

        expect(err).toEqual(new MissingParamError("any_field"))
    })
})