import { LogControllerDecorator } from "../../decorator/log-controller-decorator";
import { Controller } from "../../../presentation/protocols";
import { makeLoginValidation, } from "./login-validation-factory";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { LogErrorMongoRepository } from "../../../infra/db/mongodb/log/log-repository";
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { JWTAdapter } from "../../../infra/criptography/jwt/jwt-adapter";
import env from "../../config/env";

export const makeLoginController = (): Controller => {
    const salt = 12;
    const validation = makeLoginValidation()
    const logRepository = new LogErrorMongoRepository()

    const mongoAccount = new AccountMongoRepository()
    const hasherComparer = new BcryptAdapter(salt);
    const enrypter = new JWTAdapter(env.SECRET);

    const auth = new DbAuthentication(mongoAccount, hasherComparer, enrypter, mongoAccount)
    const loginController = new LoginController(validation, auth)
    return new LogControllerDecorator(loginController, logRepository)

}