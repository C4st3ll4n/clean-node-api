import { AccountModel } from "@/domain/models/account";
import { AddAccountParam } from "@/domain/usecases/account/add-account";

export interface AddAccountRepository {
    add(accountData: AddAccountParam): Promise<AccountModel>
}