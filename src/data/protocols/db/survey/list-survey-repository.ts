import { SurveyModel } from "../../../../domain/models/survey";

export interface ListSurveyRepository{
    all():Promise<SurveyModel[]>
}