import {LoadAccountByToken} from "@/domain/usecases/account/load-account-by-token";
import {Decrypter} from "@/data/protocols/criptography/decrypter";
import {LoadAccountByTokenRepository} from "@/data/protocols/db/account/load-account-by-token-repository";
import {AccountModel} from "@/domain/models/account";

export class DBLoadAccountByToken implements LoadAccountByToken {
    constructor(
        private readonly decrypter: Decrypter,
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
    ) {
    }

    async loadByToken(token: string, role?: string): Promise<AccountModel> {
        let decryptedToken;
        try {
            decryptedToken = await this.decrypter.decrypt(token);
        } catch (e) {
            return null
        }

        if (decryptedToken) {
            return this.loadAccountByTokenRepository.loadByToken(
                token,
                role
            );
        }

        return null;
    }
}
