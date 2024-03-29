import { AccountModel } from "../../models/account"

export interface LoadAccountByToken {
    loadByToken(token: string, role?: string): Promise<LoadAccountByToken.Result>
}

export namespace LoadAccountByToken {
    export type Result = AccountModel
}