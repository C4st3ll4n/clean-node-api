import {AddAccountRepository} from "@/data/protocols/db/account/add-account-repository";
import {AddAccountParam} from "@/domain/usecases/account/add-account";
import {AccountModel} from "@/domain/models/account";
import {mockAccount} from "@/domain/test";
import {LoadAccountByEmailRepository} from "@/data/protocols/db/account/load-account-by-email-repository";
import {LoadAccountByTokenRepository} from "@/data/protocols/db/account/load-account-by-token-repository";
import {UpdateAcessTokenRepository} from "@/data/protocols/db/account/update-access-token-repository";


export const makeAddAccountRepositoryStub = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountParam): Promise<AccountModel> {
            return new Promise((resolve) => resolve(mockAccount()));
        }
    }

    return new AddAccountRepositoryStub();
};


export const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(mockAccount()))
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}


export const makeLoadAccountByTokenStub = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
        implements LoadAccountByTokenRepository {
        async loadByToken(token: string, role?: string): Promise<AccountModel> {
            return new Promise((resolve) => resolve(mockAccount()));
        }
    }

    return new LoadAccountByTokenRepositoryStub();
};


export const makeUpdateAccessTokenRepositoryStub = (): UpdateAcessTokenRepository => {
    class UpdateAcessTokenStub implements UpdateAcessTokenRepository {
        async updateAccessToken(identifier: string, token: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new UpdateAcessTokenStub();
}
