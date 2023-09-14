import {DbLoadSurveyResult} from "@/data/usecases/survey-result/load-survey-result/db-load-survey-result";
import {LoadSurveyResultRepository} from "@/data/protocols/db/survey-result/load-survey-result-repository";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {throwError} from "@/domain/test";
import {makeFakeSurveyResult} from "@/domain/test/mock-survey-result";
import {ListSurvey} from "@/domain/usecases/survey/list-survey";
import {ListSurveyRepository} from "@/data/protocols/db/survey/list-survey-repository";
import {makeListSurveyRepositoryStub} from "@/data/test";

type SUTTypes = {
    sut: DbLoadSurveyResult
    loadSurveyResultRepository: LoadSurveyResultRepository
    loadSurveyRepository: ListSurveyRepository
}
const mockLoadSurveyResultRepository = ():LoadSurveyResultRepository => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
        loadBySurveyId(surveyId: string, accountId: string): Promise<SurveyResultModel> {
            return Promise.resolve(makeFakeSurveyResult());
        }

    }

    return new LoadSurveyResultRepositoryStub();
};
const makeSUT = ():SUTTypes => {
    const loadSurveyRepository: ListSurveyRepository = makeListSurveyRepositoryStub()
    const loadSurveyResultRepository = mockLoadSurveyResultRepository();
    const sut = new DbLoadSurveyResult(loadSurveyResultRepository, loadSurveyRepository);

    return {sut, loadSurveyResultRepository, loadSurveyRepository};
};
describe("DB Load Survey Result UseCase", ()=>{

    test("Should call repository correctly", async ()=>{
        const {sut, loadSurveyResultRepository} = makeSUT();
        const loadSpy = jest.spyOn(loadSurveyResultRepository, "loadBySurveyId");
        await sut.load("any_survey_id", "any_account_id");

        expect(loadSpy).toHaveBeenCalledWith("any_survey_id", "any_account_id");
    })

    test("Should throw when repository throws", ()=>{
        const {sut, loadSurveyResultRepository} = makeSUT();
        jest.spyOn(loadSurveyResultRepository, "loadBySurveyId").mockImplementationOnce(throwError);
        const promise = sut.load("any_survey_id", "any_account_id");

        expect(promise).rejects.toThrow(new Error())
    })

    test("Should return a valid survey result on  success", async ()=>{
        const {sut, loadSurveyResultRepository} = makeSUT();
        const surveyResult =  await sut.load("any_survey_id", "any_account_id");

        expect(surveyResult).toBeTruthy();
        expect(surveyResult.surveyId).toEqual("any_survey_id");
        expect(surveyResult.question).toEqual("any_question");
        expect(surveyResult.answers).toBeTruthy();
        expect(surveyResult.answers[0].answer).toEqual("any_answer");
    })

    test("Should call load survey by id repository when load survey result returns null", async ()=>{
        const {sut, loadSurveyResultRepository, loadSurveyRepository} = makeSUT();
        jest.spyOn(loadSurveyResultRepository, "loadBySurveyId").mockReturnValueOnce(null);
        const loadSpy = jest.spyOn(loadSurveyRepository, "loadById");
        const surveyResult =  await sut.load("any_survey_id", "any_account_id");

        expect(loadSpy).toHaveBeenCalledWith("any_survey_id");

    })

    test("Should return a survey result with empties answer's count/percent when load survey result returns null", async ()=>{
        const {sut, loadSurveyResultRepository, loadSurveyRepository} = makeSUT();
        jest.spyOn(loadSurveyResultRepository, "loadBySurveyId").mockReturnValueOnce(null);

        const surveyResult =  await sut.load("any_survey_id", "any_account_id");

        expect(surveyResult).toBeTruthy();
        expect(surveyResult.surveyId).toEqual("any_survey_id");
        expect(surveyResult.question).toEqual("any_question");
        expect(surveyResult.answers).toBeTruthy();
        expect(surveyResult.answers[0].answer).toEqual("any_answer");
        expect(surveyResult.answers[0].count).toEqual(0);
        expect(surveyResult.answers[0].percent).toEqual(0);
    })
})