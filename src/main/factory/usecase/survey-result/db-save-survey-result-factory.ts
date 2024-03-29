import {SaveSurveyResult} from "@/domain/usecases/survey-result/save-survey-result";
import {DbSaveSurveyResult} from "@/data/usecases/survey-result/save-survey-result/db-save-survey-result";
import {SurveyResultMongoRepository} from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";

export const makeSaveSurveyResult = (): SaveSurveyResult => {
    const mongoSurveyRepository = new SurveyResultMongoRepository();
    return new DbSaveSurveyResult(mongoSurveyRepository, mongoSurveyRepository);
}