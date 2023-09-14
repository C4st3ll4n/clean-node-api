import { Answer } from "./answer";

export type SurveyModel = {
  id: string
  question: string;
  answers: Answer[];
  date: Date
  didAnswer?: true
}
