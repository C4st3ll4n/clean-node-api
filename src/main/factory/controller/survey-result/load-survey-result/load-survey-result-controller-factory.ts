import {Controller} from "@/presentation/protocols";
import {
    LoadSurveyResultController
} from "@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller";
import {makeDBLoadSurveyResult} from "@/main/factory/usecase/survey-result/db-load-survey-result-factory";

export const makeLoadSurveyResultController = (): Controller => {
    return new LoadSurveyResultController(makeDBLoadSurveyResult());
}