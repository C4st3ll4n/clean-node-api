import {SaveSurveyResultParam} from "@/domain/usecases/survey-result/save-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";

export interface LoadSurveyResultRepository {
  loadBySurveyId(surveyId: string, accountId: string): Promise<SurveyResultModel>;
}
