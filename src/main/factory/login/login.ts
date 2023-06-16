import { LogControllerDecorator } from "../../decorator/log-controller-decorator";
import { Controller } from "../../../presentation/protocols";
import { makeLoginValidation, } from "./login-validation-factory";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { LogErrorMongoRepository } from "../../../infra/db/mongodb/log/log-repository";

export const makeLoginController = (): Controller => {
    const validation = makeLoginValidation()
    const logRepository = new LogErrorMongoRepository()

    //const auth = new Lo
    const signupController = new LoginController(validation, auth)
    return new LogControllerDecorator(signupController, logRepository)

}