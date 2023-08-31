import { SurveyModel } from "../../models/survey";

export interface ListSurvey{
    getAll(): Promise<SurveyModel[]>
}