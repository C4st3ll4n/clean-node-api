import {Router} from "express";
import {adaptRoute} from "../adapter/express-route-adapter";
import {makeLogControllerDecorator} from "../factory/decorator/log-controller-decorator-factory";
import {makeCreateSurveyController} from "../factory/controller/survey/create-survey/create-survey-controller-factory";
import {adaptMiddleware} from "../adapter/express-middleware-adapter";
import {makeAuthMiddleware} from "../factory/middleware/auth-middleware-factory";
import {makeListSurveyController} from "../factory/controller/survey/list-survey/list-survey-controller-factory";
import {adminAuth} from "../middlewares/admin-auth";
import {auth} from "../middlewares/auth";
import {
    makeSaveSurveyResultController
} from "@/main/factory/controller/survey-result/save-survey-result-controller-factory";

export default (router: Router): void => {

    router.put(
        "/surveys/:surveyId/results", auth,
        adaptRoute(makeLogControllerDecorator(makeSaveSurveyResultController()))
    );
};
