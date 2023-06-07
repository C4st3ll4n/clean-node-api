import { AuthModel, Authentication } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";

export class DbAuthentication implements Authentication{

    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashCompare:HashComparer
    private readonly tokenGenerator:TokenGenerator

    constructor(loadAccountByEmailRepo: LoadAccountByEmailRepository, hashCompare:HashComparer, tokenGenerator:TokenGenerator){
        this.loadAccountByEmailRepository = loadAccountByEmailRepo;
        this.hashCompare = hashCompare;
        this.tokenGenerator = tokenGenerator;
    }
    async auth(authentication: AuthModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email);
        if(account){
            await this.hashCompare.compare(authentication.password, account.password);

            await this.tokenGenerator.generate(account.id);
        }
    
        return null
    }

}