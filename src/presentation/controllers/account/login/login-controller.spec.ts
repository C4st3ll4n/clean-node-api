import {InvalidParamError, MissingParamError} from "../../../errors"
import {badRequest, ok, serverError, unauthorized} from "../../../helpers/http/http-helper"
import {Validation} from "../../../protocols"
import {LoginController} from "./login-controller"
import {Authentication} from "./login-controller-protocols"
import {throwError} from "@/domain/test";
import {makeValidationStub} from "@/validation/test";
import {AuthenticationModel} from "@/domain/models/authentication";

type SutTypes = {
    sut: LoginController,
    validation: Validation,
    authentication: Authentication
}


const makeAuth = (): Authentication => {
    class AuthStub implements Authentication {
        async auth(email: Authentication.Params): Promise<Authentication.Result> {
            return new Promise(resolve => resolve({
                name: "any_name",
                accessToken: "any_token"
            }))
        }
    }

    return new AuthStub()
}

const makeSut = (): SutTypes => {

    const validation = makeValidationStub()
    const authentication = makeAuth()
    const sut = new LoginController(validation, authentication)

    return {
        sut,
        validation,
        authentication
    }
}

const makeHttpRequest = (): LoginController.Request => ({
    email: "valid_email@mail.com",
    password: "any_password"
})

describe("Login Controller", () => {

    test("Should return 400 if no email is provided", async () => {
        const {sut, validation} = makeSut()

        jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamError("email"))

        const httpRequest: LoginController.Request = {
            password: "any_password", email: undefined
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
    })

    test("Should return 400 if no password is provided", async () => {
        const {sut, validation} = makeSut()

        jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamError("password"))

        const httpRequest:LoginController.Request = {
                email: "any_mail@mail.com", password: undefined
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
    })

    test("Should call Validation", async () => {
        const {sut, validation} = makeSut()
        const isValidSpy = jest.spyOn(validation, 'validate')
        const httpRequest = makeHttpRequest()

        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith({email: "valid_email@mail.com", password: "any_password"})
    })

    test("Should return 500 if EmailValidator throws", async () => {
        const {sut, validation} = makeSut()

        jest.spyOn(validation, 'validate').mockImplementationOnce(throwError)
        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(new Error(null)))
    })

    test("Should return 400 if EmailValidator returns false", async () => {
        const {sut, validation} = makeSut()

        jest.spyOn(validation, 'validate').mockImplementationOnce(() => {
            return new InvalidParamError("email")
        })

        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
    })

    test("Should call Authentication", async () => {
        const {sut, authentication} = makeSut()
        const authSpy = jest.spyOn(authentication, 'auth')
        const httpRequest = makeHttpRequest()

        sut.handle(httpRequest)
        expect(authSpy).toHaveBeenCalledWith({email: "valid_email@mail.com", password: "any_password"})
    })

    test("Should return 401 if invalid credentials are provided", async () => {
        const {sut, authentication} = makeSut()

        jest.spyOn(authentication, 'auth').mockImplementationOnce(() => {
            return null
        })

        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(unauthorized())
    })

    test("Should return 500 if Authentication throws", async () => {
        const {sut, authentication} = makeSut()

        jest.spyOn(authentication, 'auth').mockImplementationOnce(throwError)

        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(new Error(null)))
    })

    test("Should return 200 when valid credentials are provided", async () => {
        const {sut} = makeSut()

        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        console.log(httpResponse)
        expect(httpResponse).toEqual(ok({accessToken: "any_token", name: "any_name"}))
    })
})