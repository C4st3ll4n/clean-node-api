import {
  AddAccount,
  AccountModel,
  AddAccountModel,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const email = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
    const encryptedPassword = await this.hasher.hash(accountData.password);
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: encryptedPassword })
    );

    return account;
  }
}
