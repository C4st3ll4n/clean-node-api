import { Answer } from "./answer";

export interface SurveyModel {
  question: string;
  answers: Answer[];
}
