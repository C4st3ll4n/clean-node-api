import {SaveSurveyResult} from "@/domain/usecases/survey-result/save-survey-result";
import {DbSaveSurveyResult} from "@/data/usecases/survey-result/save-survey-result/db-save-survey-result";
import {SurveyMongoRepository} from "@/infra/db/mongodb/survey/survey-mongo-repository";
import {SurveyResultMongoRepository} from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";

export const makeSaveSurveyResult = (): SaveSurveyResult => {
    return new DbSaveSurveyResult(new SurveyResultMongoRepository())
}