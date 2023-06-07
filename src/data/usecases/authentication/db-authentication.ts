import { AuthModel, Authentication } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";

export class DbAuthentication implements Authentication{

    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashCompare:HashComparer

    constructor(loadAccountByEmailRepo: LoadAccountByEmailRepository, hashCompare:HashComparer){
        this.loadAccountByEmailRepository = loadAccountByEmailRepo;
        this.hashCompare = hashCompare;
    }
    async auth(authentication: AuthModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email);
        if(account){
            await this.hashCompare.compare(authentication.password, account.password);
        }
    
        return null
    }

}