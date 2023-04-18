import { LogControllerDecorator } from "../../decorator/log";
import { Controller } from "../../../presentation/protocols";
import { makeLoginValidation, } from "./login-validation";
import { LoginController } from "../../../presentation/controllers/login/login";
import { LogErrorMongoRepository } from "../../../infra/db/mongodb/log-repository/log";

export const makeLoginController = (): Controller => {
    const validation = makeLoginValidation()
    const logRepository = new LogErrorMongoRepository()

    //const auth = new Lo
    const signupController = new LoginController(validation, auth)
    return new LogControllerDecorator(signupController, logRepository)

}