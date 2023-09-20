import {AddSurvey} from "@/domain/usecases/survey/add-survey";

export interface AddSurveyRepository {
  add(data: AddSurveyRepository.Param): Promise<void>;
}
export namespace AddSurveyRepository {
  export type Param = AddSurvey.Param
}
