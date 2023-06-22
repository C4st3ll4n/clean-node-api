import { MissingParamError } from "../../errors"
import { CompareFieldsValidation } from "./compare-fields-validation"
import { InvalidParamError } from "../../errors"

describe("Compare Field Validation", ()=>{
    test("Should return MissingParamError when validation fails", ()=>{
        const sut = new CompareFieldsValidation("any_field","field_to_compare")

        const err = sut.validate(
            {
                any_field:"same",
                field_to_compare:"different"
            }
        )

        expect(err).toEqual(new InvalidParamError("field_to_compare"))
    })

    
    test("Should not return when validation succeeds", ()=>{
        const sut = new CompareFieldsValidation("any_field", "field_to_compare")

        const err = sut.validate({
            any_field:"same",
            field_to_compare:"same"
        })

        expect(err).toBeFalsy()
    })
})