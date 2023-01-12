import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from "./db-add-account-protocols"
import { DbAddAccount } from "./db-add-account"

interface SutTypes {
    sut: DbAddAccount,
    encrypterStub: Encrypter,
    addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve("hashed_password"))
        }
    }
    return new EncrypterStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email',
                password: 'hashed_password'
            }
            return new Promise(resolve => resolve(fakeAccount))
        }

    }
    return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypterStub()
    const addAccountRepositoryStub = makeAddAccountRepositoryStub()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    }
}

describe("DbAddAccount Usecase", () => {

    test("Should call Encrypter with correct password", () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

        const accountData = {
            name: "valid_name",
            email: "valid_email",
            password: "valid_password"
        }
        sut.add(accountData)
        expect(encryptSpy).toBeCalledWith('valid_password')
    })

    test("Should throw if Encrypter throws", async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const accountData = {
            name: "valid_name",
            email: "valid_email",
            password: "valid_password"
        }
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })

    test("Should call AddAccountRepository with correct values", async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

        const accountData = {
            name: "valid_name",
            email: "valid_email",
            password: "valid_password"
        }
        sut.add(accountData)
        expect(addSpy).toBeCalledWith({
            name: "valid_name",
            email: "valid_email",
            password: "hashed_password"
        })
    })
})