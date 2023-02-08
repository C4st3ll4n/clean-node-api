import { SignUpController } from "../../presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { LogControllerDecorator } from "../decorator/log";
import { Controller } from "../../presentation/protocols";

export const makeSignUpController = (): Controller => {
    const salt = 12;
    const bcryptAdapter = new BcryptAdapter(salt)

    const accountRepository = new AccountMongoRepository()

    const emailValidatorAdapter = new EmailValidatorAdapter()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)

    return new LogControllerDecorator(new SignUpController(emailValidatorAdapter, dbAddAccount))

}