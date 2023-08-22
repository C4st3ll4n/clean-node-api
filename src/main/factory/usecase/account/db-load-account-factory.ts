import { DBLoadAccountByToken } from "@/data/usecases/load-account-by-token/db-load-account-by-token";
import { JWTAdapter } from "@/infra/criptography/jwt/jwt-adapter";
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository";
import env from "../../../config/env";


export const makeDbLoadAccount = (): DBLoadAccountByToken => {
    return new DBLoadAccountByToken(new JWTAdapter(env.SECRET), new AccountMongoRepository());
}