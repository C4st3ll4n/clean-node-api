import {
    HashComparer,
    LoadAccountByEmailRepository,
    UpdateAcessTokenRepository,
    Encrypter
} from "./db-authentication-protocols"
import { DbAuthentication } from "./db-authentication"
import {mockAuthParam, throwError} from "@/domain/test";
import {
    makeEncrypterStub,
    makeHashCompareStub, makeLoadAccountStub,
    makeUpdateAccessTokenRepositoryStub
} from "@/data/test";

type SutTypes ={
    sut: DbAuthentication,
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompareStub: HashComparer,
    encrypterStub: Encrypter,
    updateAccessTokenRepoStub: UpdateAcessTokenRepository
}


const makeSut = (): SutTypes => {
    const loadAccountByEmailRepository = makeLoadAccountStub();
    const hashCompareStub = makeHashCompareStub();
    const encrypterStub = makeEncrypterStub();
    const updateAccessTokenRepoStub = makeUpdateAccessTokenRepositoryStub();
    const sut = new DbAuthentication(
        loadAccountByEmailRepository, hashCompareStub, encrypterStub, updateAccessTokenRepoStub);

    return {
        sut,
        loadAccountByEmailRepository,
        hashCompareStub,
        encrypterStub: encrypterStub,
        updateAccessTokenRepoStub
    }
}


describe("DbAuthentication UseCase", () => {

    test("Should call LoadAccountByEmailRepository with correct email", async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()

        const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')
        await sut.auth(mockAuthParam())

        expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com")
    })

    test("Should throw if LoadAccountByEmailRepository throws", async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()
        jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthParam())
        await expect(promise).rejects.toThrow()
    })

    test("Should return null when LoadAccountByEmailRepository returns null", async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()

        jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockReturnValue(null)
        const accessToken = await sut.auth(mockAuthParam())

        expect(accessToken).toBeNull()
    })

    test("Should call HashCompare with correct values", async () => {
        const { sut, hashCompareStub } = makeSut()

        const compareSpy = jest.spyOn(hashCompareStub, 'compare')
        await sut.auth(mockAuthParam())

        expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password")
    })

    test("Should throw if HashCompare throws", async () => {
        const { sut, hashCompareStub } = makeSut()
        jest.spyOn(hashCompareStub, 'compare').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthParam())
        await expect(promise).rejects.toThrow()
    })

    test("Should return null when HashCompare returns false", async () => {
        const { sut, hashCompareStub } = makeSut()

        jest.spyOn(hashCompareStub, 'compare').mockReturnValue(new Promise(resolve => resolve(false)))
        const accessToken = await sut.auth(mockAuthParam())

        expect(accessToken).toBeNull()
    })

    test("Should call Encrypter with correct value", async () => {
        const { sut, encrypterStub } = makeSut()

        const generatorSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(mockAuthParam())

        expect(generatorSpy).toHaveBeenCalledWith("any_id")
    })

    test("Should throw if Encrypter throws", async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthParam())
        await expect(promise).rejects.toThrow()
    })

    test("Should return a access token", async () => {
        const { sut } = makeSut()
        const accessToken = await sut.auth(mockAuthParam())
        expect(accessToken.accessToken).toBe("valid_token")
        expect(accessToken.name).toBe("any_name")
    })

    test("Should call UpdateAccessTokenRepository with correct values", async () => {
        const { sut, updateAccessTokenRepoStub } = makeSut()

        const updateSpy = jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken')
        await sut.auth(mockAuthParam())

        expect(updateSpy).toHaveBeenCalledWith("any_id", "valid_token")
    })

    test("Should throw if UpdateAccessTokenRepository throws", async () => {
        const { sut, updateAccessTokenRepoStub } = makeSut()
        jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthParam())
        await expect(promise).rejects.toThrow()
    })

})