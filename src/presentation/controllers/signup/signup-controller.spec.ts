import { SignUpController } from "./signup-controller"
import { MissingParamError } from "../../errors"
import { AddAccount, AddAccountModel, AccountModel, HttpRequest, Validation } from "./signup-controller-protocols"
import { serverError, badRequest, created } from "../../helpers/http/http-helper"

interface SutTypes {
    sut: SignUpController,
    addAccountStub: AddAccount,
    validationStub: Validation
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input:any):Error{
            return null
        }
    }

    return new ValidationStub()
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
        async add(account: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeAccountModel()))
        }
    }

    return new AddAccountStub()
}

const makeSut = (): SutTypes => {

    const addAccountStub = makeAddAccount()
    const validationStub = makeValidation()
    const sut = new SignUpController(addAccountStub, validationStub)

    return {
        sut,
        addAccountStub,
        validationStub
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
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })
        const httpResponse = await sut.handle(makeHttpRequest())

        expect(httpResponse).toEqual(serverError(Error(null)))

    })

    test("Should return 201 if valid data is provided", async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.handle(makeHttpRequest())

        expect(httpResponse).toEqual(created(makeAccountModel()))
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
})