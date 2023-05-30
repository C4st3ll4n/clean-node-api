import { AuthModel, Authentication } from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";

export class DbAuthentication implements Authentication{

    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

    constructor(loadAccountByEmailRepo: LoadAccountByEmailRepository){
        this.loadAccountByEmailRepository = loadAccountByEmailRepo;
    }
    async auth(authentication: AuthModel): Promise<string> {
        await this.loadAccountByEmailRepository.load(authentication.email);
        return null
    }

}