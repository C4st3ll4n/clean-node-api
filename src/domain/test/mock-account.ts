import {AccountModel} from "@/domain/models/account";
import {AddAccount} from "@/domain/usecases/account/add-account";
import {Authentication,} from "@/domain/usecases/account/authentication";

export const mockAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
})

export const mockAccountParam = (): AddAccount.Params => ({
    name: "any_name",
    email: "any_email",
    password: "any_password",
});

export const mockAuthParam = (): Authentication.Params => ({
    email: "any_email@mail.com",
    password: "any_password"
})