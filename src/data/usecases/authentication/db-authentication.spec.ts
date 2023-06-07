import { AuthModel } from "../../../domain/usecases/authentication"
import { HashComparer } from "../../protocols/criptography/hash-comparer"
import { TokenGenerator } from "../../protocols/criptography/token-generator"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

interface SutTypes {
    sut: DbAuthentication,
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompareStub: HashComparer,
    tokenGeneratorStub: TokenGenerator
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
})

const makeTokenGeneratorStub = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
        async generate(identifier: string): Promise<string> {
            return new Promise(resolve => resolve("valid_token"))
        }
    }

    return new TokenGeneratorStub();
}

const makeHashCompareStub = (): HashComparer => {
    class HashCompareStub implements HashComparer {
        async compare(value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }
    return new HashCompareStub()
}

const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string): Promise<AccountModel> {
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
    const tokenGeneratorStub = makeTokenGeneratorStub()

    const sut = new DbAuthentication(
        loadAccountByEmailRepository, hashCompareStub, tokenGeneratorStub);

    return {
        sut,
        loadAccountByEmailRepository,
        hashCompareStub,
        tokenGeneratorStub
    }
}


describe("DbAuthentication UseCase", () => {

    test("Should call LoadAccountByEmailRepository with correct email", async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()

        const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
        await sut.auth(makeFakeAuth())

        expect(loadSpy).toHaveBeenCalledWith("valid_email")
    })

    test("Should throw if LoadAccountByEmailRepository throws", async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()
        jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuth())
        await expect(promise).rejects.toThrow()
    })

    test("Should return null when LoadAccountByEmailRepository returns null", async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()

        jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValue(null)
        const accessToken = await sut.auth(makeFakeAuth())

        expect(accessToken).toBeNull()
    })

    test("Should call HashCompare with correct values", async () => {
        const { sut, hashCompareStub } = makeSut()

        const compareSpy = jest.spyOn(hashCompareStub, 'compare')
        await sut.auth(makeFakeAuth())

        expect(compareSpy).toHaveBeenCalledWith("valid_password", "hashed_password")
    })

    test("Should throw if HashCompare throws", async () => {
        const { sut, hashCompareStub } = makeSut()
        jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuth())
        await expect(promise).rejects.toThrow()
    })

    test("Should return null when HashCompare returns false", async () => {
        const { sut, hashCompareStub } = makeSut()

        jest.spyOn(hashCompareStub, 'compare').mockReturnValue(new Promise(resolve => resolve(false)))
        const accessToken = await sut.auth(makeFakeAuth())

        expect(accessToken).toBeNull()
    })

    test("Should call TokenGenerator with correct value", async () => {
        const { sut, tokenGeneratorStub } = makeSut()

        const generatorSpy = jest.spyOn(tokenGeneratorStub, 'generate')
        await sut.auth(makeFakeAuth())

        expect(generatorSpy).toHaveBeenCalledWith("valid_id")
    })

    test("Should throw if TokenGenerator throws", async () => {
        const { sut, tokenGeneratorStub } = makeSut()
        jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuth())
        await expect(promise).rejects.toThrow()
    })

})