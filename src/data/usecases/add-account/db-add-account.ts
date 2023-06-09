import { AddAccount, AccountModel, AddAccountModel, Hasher, AddAccountRepository } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount {
    private readonly hasher: Hasher
    private readonly addAccountRepository: AddAccountRepository

    constructor(hasher: Hasher, repository: AddAccountRepository) {
        this.hasher = hasher
        this.addAccountRepository = repository
    }
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const encryptedPassword = await this.hasher.hash(accountData.password)
        const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: encryptedPassword }))

        return account
    }

}