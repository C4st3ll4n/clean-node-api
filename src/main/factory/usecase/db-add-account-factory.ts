import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";

export const makeDbAddAccount = (): DbAddAccount => {
    const salt = 12;
    const dbAddAccount = new DbAddAccount(new BcryptAdapter(salt), new AccountMongoRepository());  
    return dbAddAccount;
}