import {LoadSurveyResult} from "@/domain/usecases/survey-result/load-survey-result";
import {DbLoadSurveyResult} from "@/data/usecases/survey-result/load-survey-result/db-load-survey-result";
import {SurveyResultMongoRepository} from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";
import {SurveyMongoRepository} from "@/infra/db/mongodb/survey/survey-mongo-repository";

export const makeDBLoadSurveyResult = (): LoadSurveyResult => {
    const mongoSurveyResultRepository = new SurveyResultMongoRepository();
    const mongoSurveyRepository = new SurveyMongoRepository();

    return new DbLoadSurveyResult(mongoSurveyResultRepository, mongoSurveyRepository);
}