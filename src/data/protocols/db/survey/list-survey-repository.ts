import { SurveyModel } from "@/domain/models/survey";

export interface ListSurveyRepository{
    all():Promise<ListSurveyRepository.Results>
    loadByAccountID(accountId:string):Promise<ListSurveyRepository.Results>
    loadById(surveyId: string):Promise<ListSurveyRepository.Result>
}

export  namespace ListSurveyRepository {
    export type Result = SurveyModel
    export type Results = SurveyModel[]
}