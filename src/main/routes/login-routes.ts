import { Router } from "express";
import { makeSignUpController } from "../factory/controller/account/signup/signup-controller-factory";
import { adaptRoute } from "../adapter/express-route-adapter";
import { makeLoginController } from "../factory/controller/account/login/login-controller-factory";
import { makeLogControllerDecorator } from "../factory/decorator/log-controller-decorator-factory";

export default (router: Router): void => {
  router.post(
    "/signup",
    adaptRoute(makeLogControllerDecorator(makeSignUpController()))
  );
  router.post(
    "/login",
    adaptRoute(makeLogControllerDecorator(makeLoginController()))
  );
};
