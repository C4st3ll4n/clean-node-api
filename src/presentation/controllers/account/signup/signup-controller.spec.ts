import { SignUpController } from "./signup-controller"
import { EmailInUseError, MissingParamError } from "../../../errors"
import { AddAccount, AddAccountParam, AccountModel, HttpRequest, Validation, Authentication, AuthParam } from "./signup-controller-protocols"
import { serverError, badRequest, ok, forbidden } from "../../../helpers/http/http-helper"
import {throwError} from "@/domain/test";
import {makeValidationStub} from "@/validation/test";

type SutTypes ={
    sut: SignUpController,
    addAccountStub: AddAccount,
    validationStub: Validation,
    authentication: Authentication
}

const makeHttpRequest = (): HttpRequest => ({
    body: {
        name: "any_name",
        email: "valid_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
    }
})

const makeAccountModel = (): AccountModel => (
    {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
    }
)

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountParam): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeAccountModel()))
        }
    }

    return new AddAccountStub()
}


const makeAuth = (): Authentication => {
    class AuthStub implements Authentication {
        async auth(email: AuthParam): Promise<string> {
            return new Promise(resolve => resolve("any_token"))
        }
    }

    return new AuthStub()
}

const makeSut = (): SutTypes => {

    const addAccountStub = makeAddAccount()
    const validationStub = makeValidationStub()
    const authentication = makeAuth()
    const sut = new SignUpController(addAccountStub, validationStub, authentication)

    return {
        sut,
        addAccountStub,
        validationStub,
        authentication
    }
}

describe("SignUp Controller", () => {

    test("Should call AddAccount with correct values", async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpySpy = jest.spyOn(addAccountStub, 'add')

        sut.handle(makeHttpRequest())
        expect(addSpySpy).toHaveBeenCalledWith({
            name: "any_name",
            email: "valid_email@mail.com",
            password: "any_password",
        })
    })

    test("Should return 500 if EmailValidator throws", async () => {

        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(makeHttpRequest())

        expect(httpResponse).toEqual(serverError(Error(undefined)))

    })

    test("Should return 403 if add account returns null", async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => resolve(null))
        })
        const httpResponse = await sut.handle(makeHttpRequest())

        expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
    })

    test("Should return 200 if valid data is provided", async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.handle(makeHttpRequest())

        expect(httpResponse).toEqual(ok({accessToken: "any_token"}))
    })

    test("Should call Validation with correct values", async () => {
        const { sut, validationStub } = makeSut()
        const addSpySpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeHttpRequest()
        await sut.handle(httpRequest)
        expect(addSpySpy).toHaveBeenCalledWith(httpRequest.body)
    })    

    test("Should return 400 if validation returns an error", async () => {
        const { sut, validationStub } = makeSut()

        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError("any_field"))

        const httpResponse = await sut.handle(makeHttpRequest())

        expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
    })

    test("Should call Authentication", async () => {
        const { sut, authentication } = makeSut()
        const authSpy = jest.spyOn(authentication, 'auth')
        const httpRequest = makeHttpRequest()

        await sut.handle(httpRequest)
        expect(authSpy).toHaveBeenCalledWith({email: "valid_email@mail.com", password: "any_password"})
    })

    test("Should return 500 if Authentication throws", async () => {
        const { sut, authentication } = makeSut()

        jest.spyOn(authentication, 'auth').mockImplementationOnce(throwError)
        const httpRequest = makeHttpRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(new Error(undefined)))
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