import {SaveSurveyResult, SaveSurveyResultParam} from "@/domain/usecases/survey-result/save-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {SaveSurveyResultRepository} from "@/data/protocols/db/survey-result/save-survey-result-repository";

export class DbSaveSurveyResult implements SaveSurveyResult{

    constructor(private readonly repository:SaveSurveyResultRepository) {
    }

    async save(data: SaveSurveyResultParam): Promise<SurveyResultModel> {
        return await this.repository.save(data);
    }

}