import {LoadAccountByToken} from "@/domain/usecases/account/load-account-by-token";
import {Decrypter} from "../../../protocols/criptography/decrypter";
import {LoadAccountByTokenRepository} from "../../../protocols/db/account/load-account-by-token-repository";
import {AccountModel} from "@/domain/models/account";

export class DBLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const decryptedToken = await this.decrypter.decrypt(token);
    if (decryptedToken) {
      return this.loadAccountByTokenRepository.loadByToken(
          token,
          role
      );
    }

    return null;
  }
}
