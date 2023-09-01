import {SurveyModel} from "@/domain/models/survey";

export type AddSurveyParam = Omit<SurveyModel, 'id'>

export interface AddSurvey {
    add(data: AddSurveyParam): Promise<void>
}