import { SignUpController } from "../../../../presentation/controllers/signup/signup-controller";
import { Controller } from "../../../../presentation/protocols";
import { makeSignUpValidation } from "./signup-validation-factory";
import { makeDbAuthentication } from "../../usecase/db-authentication-factory";
import { makeDbAddAccount } from "../../usecase/db-add-account-factory";

export const makeSignUpController = (): Controller => {

  return  new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  );
    
};
