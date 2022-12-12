import { EmailValidatorAdapter } from "./email-validator"
import validator from "validator";

jest.mock('validator', ()=> ({
    isEmail ():  boolean {
        return true
    }
}))

describe("EmailValidator Adapter", () => {
    test("Should return false when validator returns false", () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const sut = new EmailValidatorAdapter()
        const valid = sut.isValid("invalid_email@mail.com")
        expect(valid).toBe(false)
    })

    test("Should return true when validator returns true", () => {
        const sut = new EmailValidatorAdapter()
        const valid = sut.isValid("valid_email@mail.com")
        expect(valid).toBe(true)
    })
})