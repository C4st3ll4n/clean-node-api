import { Survey } from "../../../../domain/models/survey";

export interface ListSurveyRepository{
    all():Promise<Survey[]>
}