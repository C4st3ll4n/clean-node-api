import { EmailValidatorAdapter } from "./email-validator"

describe("EmailValidator Adapter", () => {
    test("Should return false when validator returns false", () => {
        const sut = new EmailValidatorAdapter()
        const valid = sut.isValid("invalid_email@mail.com")
        expect(valid).toBe(false)
    })
})