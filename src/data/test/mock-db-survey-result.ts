import {SurveyResultModel} from "@/domain/models/survey-result";
import {SaveSurveyResultRepository} from "@/data/protocols/db/survey-result/save-survey-result-repository";
import {SaveSurveyResultParam} from "@/domain/usecases/survey-result/save-survey-result";
import {makeFakeSurveyResult} from "@/domain/test/mock-survey-result";


export const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
        save(data: SaveSurveyResultParam): Promise<void> {
            return Promise.resolve(undefined);
        }
    }

    return new SaveSurveyResultRepositoryStub();
}
