import { AddAccount, AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter
    private readonly addAccountRepository: AddAccountRepository

    constructor(encrypter: Encrypter, repository: AddAccountRepository) {
        this.encrypter = encrypter
        this.addAccountRepository = repository
    }
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const encryptedPassword = await this.encrypter.encrypt(accountData.password)
        const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: encryptedPassword }))

        return account
    }

}