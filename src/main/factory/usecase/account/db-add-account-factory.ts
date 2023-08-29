import {DbAddAccount} from "@/data/usecases/account/add-account/db-add-account";
import {BcryptAdapter} from "@/infra/criptography/bcrypt/bcrypt-adapter";
import {AccountMongoRepository} from "@/infra/db/mongodb/account/account-mongo-repository";

export const makeDbAddAccount = (): DbAddAccount => {
    const salt = 12;
    const mongoRepository = new AccountMongoRepository();
    return new DbAddAccount(new BcryptAdapter(salt), mongoRepository, mongoRepository);
}