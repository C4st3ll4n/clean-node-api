
import { Validation } from "@/presentation/protocols"
import { MissingParamError } from "@/presentation/errors"
import { ValidationComposite } from "./validation-composite"
import {makeValidationStub} from "@/validation/test/mock-validation";

type SutTypes ={
    sut: ValidationComposite,
    stubs: Validation[]
}



const makeSut = (): SutTypes => {
    const stubs:Validation[] = [makeValidationStub(), makeValidationStub()]

    const sut = new ValidationComposite(stubs)

    return {
        sut, stubs
    }
}


describe("Composite Validation", () => {
    test("Should return Error when validation fails", () => {
        const { sut, stubs } = makeSut()

        jest.spyOn(stubs[0],"validate").mockReturnValueOnce(new MissingParamError("any_field"))

        const err = sut.validate({ field: "any_value" })

        expect(err).toEqual(new MissingParamError("any_field"))
    })

    test("Should return null when validation succeeds", () => {
        const { sut } = makeSut()

        const err = sut.validate({ field: "any_value" })

        expect(err).toBeFalsy()
    })

    test("Should return the first Error when validations fails", () => {
        const { sut, stubs } = makeSut()

        jest.spyOn(stubs[0],"validate").mockReturnValueOnce(new Error("generic_error"))
        jest.spyOn(stubs[1],"validate").mockReturnValueOnce(new MissingParamError("any_field"))

        const err = sut.validate({ field: "any_value" })

        expect(err).toEqual(new Error("generic_error"))
    })


})