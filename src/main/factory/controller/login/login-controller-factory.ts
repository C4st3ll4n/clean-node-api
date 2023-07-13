import { Controller } from "../../../../presentation/protocols";
import { makeLoginValidation } from "./login-validation-factory";
import { LoginController } from "../../../../presentation/controllers/login/login-controller";
import { makeDbAuthentication } from "../../usecase/db-authentication-factory";

export const makeLoginController = (): Controller => {
  return new LoginController(makeLoginValidation(), makeDbAuthentication());
};
