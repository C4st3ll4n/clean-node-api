import { DbAddSurvey } from "@/data/usecases/survey/add-survey/db-add-survey";
import { AddSurvey } from "@/domain/usecases/survey/add-survey";
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository";

export const makeDBAddSurvey = (): AddSurvey => {
    const surveyRepository = new SurveyMongoRepository()
    return new DbAddSurvey(surveyRepository);
}