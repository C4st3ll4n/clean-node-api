import { LoadAccountByToken } from "../../../domain/usecases/load-account-by-token";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { AccountModel } from "../add-account/db-add-account-protocols";

export class DBLoadAccountByToken implements LoadAccountByToken{

    constructor(private readonly decrypter:Decrypter ) {}

    async load(token: string, role?: string): Promise<AccountModel> {
        await this.decrypter.decrypt(token);
        return null;
    }

}