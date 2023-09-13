import {SurveyResultModel} from "@/domain/models/survey-result";

export type SaveSurveyResultParam = {
    surveyId: string
    accountId: string
    answer: string
    date: Date
}

export interface SaveSurveyResult {
    save(data:SaveSurveyResultParam): Promise<SurveyResultModel>
}