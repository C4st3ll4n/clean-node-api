import { AddSurveyParam } from "@/domain/usecases/survey/add-survey";

export interface AddSurveyRepository {
  add(data: AddSurveyParam): Promise<void>;
}
