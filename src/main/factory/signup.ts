import { SignUpController } from "../../presentation/controllers/signup/signup";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { LogControllerDecorator } from "../decorator/log";
import { Controller } from "../../presentation/protocols";
import { LogErrorMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import { makeSignUpValidation } from "./signup-validation";

export const makeSignUpController = (): Controller => {
    const salt = 12;
    const bcryptAdapter = new BcryptAdapter(salt)

    const accountRepository = new AccountMongoRepository()
    const logRepository = new LogErrorMongoRepository()

    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)

    const validationComposite = makeSignUpValidation()


    const signupController = new SignUpController(dbAddAccount, validationComposite)
    return new LogControllerDecorator(signupController, logRepository)

}