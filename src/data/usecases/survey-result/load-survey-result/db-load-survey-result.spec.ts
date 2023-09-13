import {DbLoadSurveyResult} from "@/data/usecases/survey-result/load-survey-result/db-load-survey-result";
import {LoadSurveyResultRepository} from "@/data/protocols/db/survey-result/load-survey-result-repository";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {throwError} from "@/domain/test";
import {makeFakeSurveyResult} from "@/domain/test/mock-survey-result";

type SUTTypes = {
    sut: DbLoadSurveyResult
    loadSurveyResultRepository: LoadSurveyResultRepository
}
const mockLoadSurveyResultRepository = ():LoadSurveyResultRepository => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
        loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
            return Promise.resolve(makeFakeSurveyResult());
        }

    }

    return new LoadSurveyResultRepositoryStub();
};
const makeSUT = ():SUTTypes => {
    const loadSurveyResultRepository = mockLoadSurveyResultRepository();
    const sut = new DbLoadSurveyResult(loadSurveyResultRepository);

    return {sut, loadSurveyResultRepository};
};
describe("DB Load Survey Result UseCase", ()=>{

    test("Should call repository correctly", async ()=>{
        const {sut, loadSurveyResultRepository} = makeSUT();
        const loadSpy = jest.spyOn(loadSurveyResultRepository, "loadBySurveyId");
        await sut.load("any_survey_id");

        expect(loadSpy).toHaveBeenCalledWith("any_survey_id");
    })

    test("Should throw when repository throws", ()=>{
        const {sut, loadSurveyResultRepository} = makeSUT();
        jest.spyOn(loadSurveyResultRepository, "loadBySurveyId").mockImplementationOnce(throwError);
        const promise = sut.load("any_survey_id");

        expect(promise).rejects.toThrow(new Error())
    })

    test("Should return a valid survey result on  success", async ()=>{
        const {sut, loadSurveyResultRepository} = makeSUT();
        const surveyResult =  await sut.load("any_survey_id");

        expect(surveyResult).toBeTruthy();
        expect(surveyResult.surveyId).toEqual("any_survey_id");
        expect(surveyResult.question).toEqual("any_question");
        expect(surveyResult.answers).toBeTruthy();
        expect(surveyResult.answers[0].answer).toEqual("any_answer");
    })
})