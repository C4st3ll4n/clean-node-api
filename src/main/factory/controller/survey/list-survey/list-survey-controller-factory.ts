import {
    ListSurveysController
} from "../../../../../presentation/controllers/survey/list-survey/list-surveys-controller";
import {makeDBListSurveys} from "../../../usecase/survey/db-list-surveys-factory";

export const makeListSurveyController = () => new ListSurveysController(makeDBListSurveys())