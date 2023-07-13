import { LogErrorMongoRepository } from "../../../infra/db/mongodb/log/log-repository";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorator/log-controller-decorator";

export const makeLogControllerDecorator = (controller: Controller): Controller => {
    return new LogControllerDecorator(controller, new LogErrorMongoRepository());
}