import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, serverError, unauthorized, ok } from "../../helpers/http-helper"
import { Validation } from "../../helpers/validators/validation"
import { LoginController } from "./login"
import { HttpRequest, Authentication } from "./login-protocols"

interface SutTypes {
    sut: LoginController,
    validation: Validation,
    authentication: Authentication
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }

    return new ValidationStub()
}

const makeAuth = (): Authentication => {
    class AuthStub implements Authentication {
        async auth(email: string, password: string): Promise<string> {
            return new Promise(resolve => resolve("any_token"))
        }
    }

    return new AuthStub()
}

const makeSut = (): SutTypes => {

    const validation = makeValidation()
    const authentication = makeAuth()
    const sut = new LoginController(validation, authentication)

    return {
        sut,
        validation,
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
        const { sut, validation } = makeSut()

        jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamError("email"))

        const httpRequest = {
            body: {
                password: "any_password"
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
    })

    test("Should return 400 if no password is provided", async () => {
        const { sut, validation } = makeSut()

        jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamError("password"))

        const httpRequest = {
            body: {
                email: "any_mail@mail.com"
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
    })

    test("Should call Validation", async () => {
        const { sut, validation } = makeSut()
        const isValidSpy = jest.spyOn(validation, 'validate')
        const httpRequest = makeHttpRequest()

        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith({ email: "valid_email@mail.com", password:"any_password"})
    })

    test("Should return 500 if EmailValidator throws", async () => {
        const { sut, validation } = makeSut()

        jest.spyOn(validation, 'validate').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(new Error(null)))
    })

    test("Should return 400 if EmailValidator returns false", async () => {
        const { sut, validation } = makeSut()

        jest.spyOn(validation, 'validate').mockImplementationOnce(() => {
            return new InvalidParamError("email")
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

    test("Should return 200 when valid credentials are provided", async () => {
        const { sut } = makeSut()

        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(ok({
            accessToken: "any_token"
        }))
    })
})