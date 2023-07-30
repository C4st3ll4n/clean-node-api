import { Survey } from "../models/survey";

export interface ListSurvey{
    getAll(): Promise<Survey[]>
}