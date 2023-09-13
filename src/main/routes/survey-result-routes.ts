import {Router} from "express";
import {adaptRoute} from "../adapter/express-route-adapter";
import {makeLogControllerDecorator} from "../factory/decorator/log-controller-decorator-factory";
import {auth} from "../middlewares/auth";
import {
    makeSaveSurveyResultController
} from "@/main/factory/controller/survey-result/save-survey-result/save-survey-result-controller-factory";

export default (router: Router): void => {

    router.put(
        "/surveys/:surveyId/results", auth,
        adaptRoute(makeLogControllerDecorator(makeSaveSurveyResultController()))
    );
};
