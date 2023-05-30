import { AuthModel } from "../../../domain/usecases/authentication"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

interface SutTypes {
    sut: DbAuthentication,
    loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
})

const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string):Promise<AccountModel>{
            const fakeAccount = makeFakeAccount()
            return new Promise(resolve => resolve(fakeAccount))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAuth = (): AuthModel => ({
    email: "valid_email",
    password: "valid_password"
})


const makeSut = (): SutTypes => {
    const loadAccountByEmailRepository = makeLoadAccountStub()
    const sut = new DbAuthentication(loadAccountByEmailRepository)

    return {
        sut,
        loadAccountByEmailRepository
    }
}


describe("DbAuthentication UseCase", () => {

    test("Should call LoadAccountByEmailRepository with correct email", async () => {
        const {sut, loadAccountByEmailRepository} = makeSut()

        const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
        await sut.auth(makeFakeAuth())

        expect(loadSpy).toHaveBeenCalledWith("valid_email")
    })
})