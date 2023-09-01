import {AccountModel} from "@/domain/models/account";
import {AddAccountParam} from "@/domain/usecases/account/add-account";
import {AuthParam} from "@/domain/usecases/account/authentication";

export const mockAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
})

export const mockAccountParam = (): AddAccountParam => ({
    name: "any_name",
    email: "any_email",
    password: "any_password",
});

export const mockAuthParam = (): AuthParam => ({
    email: "any_email@mail.com",
    password: "any_password"
})