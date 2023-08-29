import {SaveSurveyResult, SaveSurveyResultModel} from "@/domain/usecases/save-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {SaveSurveyResultRepository} from "@/data/protocols/db/survey/save-survey-result-repository";

export class DbSaveSurveyResult implements SaveSurveyResult{

    constructor(private readonly repository:SaveSurveyResultRepository) {
    }

    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        const surveyResult = await this.repository.add(data);
        return Promise.resolve(surveyResult);
    }

}