import {DBListSurvey} from "@/data/usecases/survey/list-survey/db-list-survey";
import {SurveyMongoRepository} from "@/infra/db/mongodb/survey/survey-mongo-repository";
import {ListSurvey} from "@/domain/usecases/survey/list-survey";

export const makeDBListSurveys = ():ListSurvey => new DBListSurvey(new SurveyMongoRepository());