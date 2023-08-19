import { Answer } from "./answer";

export interface SurveyModel {
  id: string
  question: string;
  answers: Answer[];
  date: Date
}
