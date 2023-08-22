import {DbAuthentication} from "@/data/usecases/authentication/db-authentication"
import {BcryptAdapter} from "@/infra/criptography/bcrypt/bcrypt-adapter";
import {JWTAdapter} from "@/infra/criptography/jwt/jwt-adapter";
import {AccountMongoRepository} from "@/infra/db/mongodb/account/account-mongo-repository";
import env from "../../../config/env";

export const makeDbAuthentication = (): DbAuthentication => {
    const salt = 12;
    const mongoAccount = new AccountMongoRepository()
    const hasherComparer = new BcryptAdapter(salt);
    const enrypter = new JWTAdapter(env.SECRET);

    return new DbAuthentication(mongoAccount, hasherComparer, enrypter, mongoAccount);
}