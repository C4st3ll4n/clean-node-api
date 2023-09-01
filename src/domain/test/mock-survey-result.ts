import {SurveyResultModel} from "@/domain/models/survey-result";

export const makeFakeSurveyResult = (): SurveyResultModel => <SurveyResultModel>({
    accountId: "any_account",
    id: "any_id",
    date: new Date(),
    answer: "any_answer",
    surveyId: "any_survey_id"
});