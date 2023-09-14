import { SurveyModel } from "../../models/survey";

export interface ListSurvey{
    getAll(accountId: string): Promise<SurveyModel[]>
}