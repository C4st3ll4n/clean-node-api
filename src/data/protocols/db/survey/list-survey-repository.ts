import { SurveyModel } from "@/domain/models/survey";

export interface ListSurveyRepository{
    all():Promise<SurveyModel[]>
    load(accountId:string):Promise<SurveyModel[]>
    loadById(surveyId: string):Promise<SurveyModel>
}