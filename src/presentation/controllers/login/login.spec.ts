import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, serverError, unauthorized } from "../../helpers/http-helper"
import { LoginController } from "./login"
import { EmailValidator, HttpRequest, Authentication } from "./login-protocols"

interface SutTypes {
    sut: LoginController,
    emailValidatorStub: EmailValidator,
    authentication: Authentication
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

const makeAuth = (): Authentication => {
    class AuthStub implements Authentication{
        async auth(email:string, password:string): Promise<string> {
            return new Promise(resolve=>resolve("any_token"))
        }
    }

    return new AuthStub()
}

const makeSut = (): SutTypes => {

    const emailValidatorStub = makeEmailValidator()
    const authentication = makeAuth()
    const sut = new LoginController(emailValidatorStub, authentication)

    return {
        sut,
        emailValidatorStub,
        authentication
    }
}

const makeHttpRequest = (): HttpRequest => ({
    body: {
        email: "valid_email@mail.com",
        password: "any_password"
    }
})

describe("Login Controller", () => {

    test("Should return 400 if no email is provided", async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                password: "any_password"
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
    })

    test("Should return 400 if no password is provided", async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_mail@mail.com"
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
    })

    test("Should call EmailValidator", async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = makeHttpRequest()

        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith("valid_email@mail.com")
    })

    test("Should return 500 if EmailValidator throws", async () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(new Error(null)))
    })
    
    test("Should return 400 if EmailValidator returns false", async () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            return false
        })

        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
    })

    test("Should call Authentication", async () => {
        const { sut, authentication } = makeSut()
        const authSpy = jest.spyOn(authentication, 'auth')
        const httpRequest = makeHttpRequest()

        sut.handle(httpRequest)
        expect(authSpy).toHaveBeenCalledWith("valid_email@mail.com", "any_password")
    })

    test("Should return 401 if invalid credentials are provided", async () => {
        const { sut, authentication } = makeSut()

        jest.spyOn(authentication, 'auth').mockImplementationOnce(() => {
            return null
        })

        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(unauthorized())
    })

    test("Should return 500 if Authentication throws", async () => {
        const { sut, authentication } = makeSut()

        jest.spyOn(authentication, 'auth').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(new Error(null)))
    })
})