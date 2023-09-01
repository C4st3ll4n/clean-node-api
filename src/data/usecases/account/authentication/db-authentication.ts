import {
    AuthParam,
    HashComparer,
    Encrypter,
    LoadAccountByEmailRepository,
    UpdateAcessTokenRepository,
    Authentication
} from "./db-authentication-protocols"

export class DbAuthentication implements Authentication {

    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashCompare: HashComparer,
        private readonly encrypter: Encrypter,
        private readonly updateAcessTokenRepository: UpdateAcessTokenRepository) {}
    
    async auth(authentication: AuthParam): Promise<string> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);
        if (account) {
            const isValid = await this.hashCompare.compare(authentication.password, account.password);
            if (isValid) {
                const accessToken = await this.encrypter.encrypt(account.id);
                await this.updateAcessTokenRepository.updateAccessToken(account.id, accessToken);
                return accessToken;
            }
        }
        return null
    }

}