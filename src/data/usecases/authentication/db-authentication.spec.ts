import { AuthModel } from "../../../domain/usecases/authentication"
import { HashComparer } from "../../protocols/criptography/hash-comparer"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

interface SutTypes {
    sut: DbAuthentication,
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompareStub: HashComparer
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
})

const makeHashCompareStub = (): HashComparer => {
    class HashCompareStub implements HashComparer{
        async compare(value:string, hash:string): Promise<boolean>{
            return new Promise(resolve=> resolve(true))
        }
    }
    return new HashCompareStub()
}

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
    const hashCompareStub = makeHashCompareStub()
    const sut = new DbAuthentication(loadAccountByEmailRepository, hashCompareStub)

    return {
        sut,
        loadAccountByEmailRepository,
        hashCompareStub
    }
}


describe("DbAuthentication UseCase", () => {

    test("Should call LoadAccountByEmailRepository with correct email", async () => {
        const {sut, loadAccountByEmailRepository} = makeSut()

        const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
        await sut.auth(makeFakeAuth())

        expect(loadSpy).toHaveBeenCalledWith("valid_email")
    })

    test("Should throw if LoadAccountByEmailRepository throws", async () => {
        const {sut, loadAccountByEmailRepository} = makeSut()
        jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuth())
        await expect(promise).rejects.toThrow()
    })

    test("Should return null when LoadAccountByEmailRepository returns null", async () => {
        const {sut, loadAccountByEmailRepository} = makeSut()

        const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValue(null)
        const accessToken = await sut.auth(makeFakeAuth())

        expect(accessToken).toBeNull()
    })

    test("Should call HashCompare with correct password", async () => {
        const {sut, hashCompareStub} = makeSut()

        const compareSpy = jest.spyOn(hashCompareStub, 'compare')
        await sut.auth(makeFakeAuth())

        expect(compareSpy).toHaveBeenCalledWith("valid_password", "hashed_password")
    })
})