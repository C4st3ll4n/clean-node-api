import { SignUpController } from "../../../presentation/controllers/signup/signup-controller";
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { LogControllerDecorator } from "../../decorator/log-controller-decorator";
import { Controller } from "../../../presentation/protocols";
import { LogErrorMongoRepository } from "../../../infra/db/mongodb/log/log-repository";
import { makeSignUpValidation } from "./signup-validation-factory";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt/bcrypt-adapter";
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { JWTAdapter } from "../../../infra/criptography/jwt/jwt-adapter";
import env from "../../config/env";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);

  const accountRepository = new AccountMongoRepository();
  const logRepository = new LogErrorMongoRepository();

  const mongoAccount = new AccountMongoRepository();
  const hasherComparer = new BcryptAdapter(salt);
  const enrypter = new JWTAdapter(env.SECRET);

  const auth = new DbAuthentication(
    mongoAccount,
    hasherComparer,
    enrypter,
    mongoAccount
  );
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository);

  const validationComposite = makeSignUpValidation();

  const signupController = new SignUpController(
    dbAddAccount,
    validationComposite,
    auth
  );
  return new LogControllerDecorator(signupController, logRepository);
};
