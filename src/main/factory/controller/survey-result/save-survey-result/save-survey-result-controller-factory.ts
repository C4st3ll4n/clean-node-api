import {Controller} from "@/presentation/protocols";
import {
    SaveSurveyResultController
} from "@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller";
import {makeDBLoadSurveyById} from "@/main/factory/usecase/survey/db-list-surveys-factory";
import {makeSaveSurveyResult} from "@/main/factory/usecase/survey-result/db-save-survey-result-factory";

export const makeSaveSurveyResultController = (): Controller => {
    return new SaveSurveyResultController(makeDBLoadSurveyById(), makeSaveSurveyResult());
}