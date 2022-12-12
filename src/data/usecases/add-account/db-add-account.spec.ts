import { DbAddAccount } from "./db-add-account"

describe("DbAddAccount Usecase", () => {

    class EncrypterStub {
        async encrypt(value:string): Promise<string>{
            return new Promise(resolve => resolve("hashed_password"))
        }
    }

    test("Should call Encrypter with correct password", ()=> {
        const encrypterStub = new EncrypterStub()
        const sut = new DbAddAccount(encrypterStub)
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

        const accountData = {
            name: "valid_name",
            email:"valid_email",
            password:"valid_password"
        }
        sut.add(accountData)
        expect(encryptSpy).toBeCalledWith('valid_password')
    })
})