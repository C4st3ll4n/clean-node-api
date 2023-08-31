import {DBListSurvey} from "@/data/usecases/survey/list-survey/db-list-survey";
import {SurveyMongoRepository} from "@/infra/db/mongodb/survey/survey-mongo-repository";
import {ListSurvey} from "@/domain/usecases/survey/list-survey";
import {LoadSurveyById} from "@/domain/usecases/survey/load-survey-by-id";

export const makeDBListSurveys = ():ListSurvey => new DBListSurvey(new SurveyMongoRepository());

export const makeDBLoadSurveyById = ():LoadSurveyById => new DBListSurvey(new SurveyMongoRepository());