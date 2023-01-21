import { Router } from "express";
import { makeSignUpController } from "../factory/signup";
import { adaptRoute } from "../adapter/express-route-adapter";

export default (router: Router): void => {
    router.post("/signup", adaptRoute(makeSignUpController()))
}