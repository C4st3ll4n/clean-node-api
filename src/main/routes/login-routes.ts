import { Router } from "express";
import { makeSignUpController } from "../factory/signup/signup-factory";
import { adaptRoute } from "../adapter/express-route-adapter";
import { makeLoginController } from "../factory/login/login-factory";

export default (router: Router): void => {
    router.post("/signup", adaptRoute(makeSignUpController()))
    router.post("/login", adaptRoute(makeLoginController()))

}