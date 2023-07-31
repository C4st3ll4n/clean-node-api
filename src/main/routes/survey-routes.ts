
import { Router } from "express";
import { adaptRoute } from "../adapter/express-route-adapter";
import { makeLogControllerDecorator } from "../factory/decorator/log-controller-decorator-factory";
import { makeCreateSurveyController } from "../factory/controller/survey/create-survey/create-survey-controller-factory";

export default (router: Router): void => {
  router.post(
    "/surveys",
    adaptRoute(makeLogControllerDecorator(makeCreateSurveyController()))
  );
};
