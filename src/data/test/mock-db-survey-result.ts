import {SaveSurveyResultRepository} from "@/data/protocols/db/survey-result/save-survey-result-repository";


export const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
        save(data: SaveSurveyResultRepository.Param): Promise<void> {
            return Promise.resolve(undefined);
        }
    }

    return new SaveSurveyResultRepositoryStub();
}
