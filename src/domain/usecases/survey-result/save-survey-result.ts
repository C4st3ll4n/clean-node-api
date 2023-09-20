import {SurveyResultModel} from "@/domain/models/survey-result";

export interface SaveSurveyResult {
    save(data:SaveSurveyResult.Param): Promise<SaveSurveyResult.Result>
}

export namespace SaveSurveyResult {
    export type Param = {
        surveyId: string
        accountId: string
        answer: string
        date: Date
    };
    export type Result = SurveyResultModel ;
}