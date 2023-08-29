import {SaveSurveyResult, SaveSurveyResultModel} from "@/domain/usecases/survey-result/save-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {SaveSurveyResultRepository} from "@/data/protocols/db/survey-result/save-survey-result-repository";

export class DbSaveSurveyResult implements SaveSurveyResult{

    constructor(private readonly repository:SaveSurveyResultRepository) {
    }

    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        return await this.repository.save(data);
    }

}