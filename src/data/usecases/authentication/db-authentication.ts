import {
    AuthModel,
    HashComparer,
    TokenGenerator,
    LoadAccountByEmailRepository,
    UpdateAcessTokenRepository,
    Authentication
} from "./db-authentication-protocols"

export class DbAuthentication implements Authentication {

    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashCompare: HashComparer
    private readonly tokenGenerator: TokenGenerator
    private readonly updateAcessTokenRepository: UpdateAcessTokenRepository;

    constructor(loadAccountByEmailRepo: LoadAccountByEmailRepository, hashCompare: HashComparer, tokenGenerator: TokenGenerator,
        updateAcessTokenRepository: UpdateAcessTokenRepository) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepo;
        this.hashCompare = hashCompare;
        this.tokenGenerator = tokenGenerator;
        this.updateAcessTokenRepository = updateAcessTokenRepository;
    }
    async auth(authentication: AuthModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email);
        if (account) {
            const isValid = await this.hashCompare.compare(authentication.password, account.password);
            if (isValid) {
                const accessToken = await this.tokenGenerator.generate(account.id);
                await this.updateAcessTokenRepository.update(account.id, accessToken);
                return accessToken;
            }
        }
        return null
    }

}