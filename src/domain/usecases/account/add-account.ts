import { AccountModel } from "../../models/account"

export type AddAccountParam = Omit<AccountModel, 'id'>

export interface AddAccount {
    add(account: AddAccountParam): Promise<AccountModel>
}