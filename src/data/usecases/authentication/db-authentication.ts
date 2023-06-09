import {
    AuthModel,
    HashComparer,
    Encrypter,
    LoadAccountByEmailRepository,
    UpdateAcessTokenRepository,
    Authentication
} from "./db-authentication-protocols"

export class DbAuthentication implements Authentication {

    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashCompare: HashComparer
    private readonly encrypter: Encrypter
    private readonly updateAcessTokenRepository: UpdateAcessTokenRepository;

    constructor(loadAccountByEmailRepo: LoadAccountByEmailRepository, hashCompare: HashComparer, encrypter: Encrypter,
        updateAcessTokenRepository: UpdateAcessTokenRepository) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepo;
        this.hashCompare = hashCompare;
        this.encrypter = encrypter;
        this.updateAcessTokenRepository = updateAcessTokenRepository;
    }
    async auth(authentication: AuthModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email);
        if (account) {
            const isValid = await this.hashCompare.compare(authentication.password, account.password);
            if (isValid) {
                const accessToken = await this.encrypter.encrypt(account.id);
                await this.updateAcessTokenRepository.update(account.id, accessToken);
                return accessToken;
            }
        }
        return null
    }

}