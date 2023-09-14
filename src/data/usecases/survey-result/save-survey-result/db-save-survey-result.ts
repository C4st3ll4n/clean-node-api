import {SaveSurveyResult, SaveSurveyResultParam} from "@/domain/usecases/survey-result/save-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {SaveSurveyResultRepository} from "@/data/protocols/db/survey-result/save-survey-result-repository";
import {LoadSurveyResultRepository} from "@/data/protocols/db/survey-result/load-survey-result-repository";

export class DbSaveSurveyResult implements SaveSurveyResult{

    constructor(private readonly saveRepository:SaveSurveyResultRepository, private readonly loadRepository:LoadSurveyResultRepository) {
    }

    async save(data: SaveSurveyResultParam): Promise<SurveyResultModel> {
        await this.saveRepository.save(data);
        return await this.loadRepository.loadBySurveyId(data.surveyId, data.accountId);
    }

}