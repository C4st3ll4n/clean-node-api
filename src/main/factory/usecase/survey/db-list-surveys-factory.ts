import {DBListSurvey} from "@/data/usecases/list-survey/db-list-survey";
import {SurveyMongoRepository} from "@/infra/db/mongodb/survey/survey-mongo-repository";
import {ListSurvey} from "@/domain/usecases/list-survey";

export const makeDBListSurveys = ():ListSurvey => new DBListSurvey(new SurveyMongoRepository());