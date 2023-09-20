import {
    AccountModel,
    AddAccount,
    AddAccountRepository,
    Hasher,
    LoadAccountByEmailRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
    constructor(
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) {
    }

    async add(accountData: AddAccount.Params): Promise<AddAccount.Result> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
        let newAccount: AccountModel = null

        if (!account) {
            const encryptedPassword: string = await this.hasher.hash(accountData.password);
            newAccount = await this.addAccountRepository.add({
                ...accountData, password: encryptedPassword
            })
        }

        return newAccount != null;
    }
}
