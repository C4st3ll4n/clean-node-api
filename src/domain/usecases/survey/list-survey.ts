import { SurveyModel } from "../../models/survey";

export interface ListSurvey{
    getAll(accountId: string): Promise<ListSurvey.Result>
}

export namespace ListSurvey {
    export type Result = SurveyModel[]
}