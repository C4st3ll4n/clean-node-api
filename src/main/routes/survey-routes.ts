
import { Router } from "express";
import { adaptRoute } from "../adapter/express-route-adapter";
import { makeLogControllerDecorator } from "../factory/decorator/log-controller-decorator-factory";
import { makeCreateSurveyController } from "../factory/controller/survey/create-survey/create-survey-controller-factory";
import { adaptMiddleware } from "../adapter/express-middleware-adapter";
import { makeAuthMiddleware } from "../factory/middleware/auth-middleware-factory";

export default (router: Router): void => {

  const adminAuth = adaptMiddleware(makeAuthMiddleware("admin"))

  router.post(
    "/surveys", adminAuth, 
    adaptRoute(makeLogControllerDecorator(makeCreateSurveyController()))
  );
};
