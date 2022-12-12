import { EmailValidatorAdapter } from "./email-validator-adapter"
import validator from "validator";

const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}

jest.mock('validator', ()=> ({
    isEmail ():  boolean {
        return true
    }
}))

describe("EmailValidator Adapter", () => {
    test("Should return false when validator returns false", () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const sut = makeSut()
        const valid = sut.isValid("invalid_email@mail.com")
        expect(valid).toBe(false)
    })

    test("Should return true when validator returns true", () => {
        const sut = makeSut()
        const valid = sut.isValid("valid_email@mail.com")
        expect(valid).toBe(true)
    })

    test("Should call validator with correct email", () => {
        const sut = makeSut()
        const spy = jest.spyOn(validator, 'isEmail')
        sut.isValid("valid_email@mail.com")
        expect(spy).toBeCalledWith("valid_email@mail.com")
    })
})