import {DbSaveSurveyResult} from "@/data/usecases/survey-result/save-survey-result/db-save-survey-result";
import {SaveSurveyResultRepository} from "@/data/protocols/db/survey-result/save-survey-result-repository";
import {SurveyResultModel} from "@/domain/models/survey-result";
import mockdate from "mockdate";
import {throwError} from "@/domain/test";
import {makeSaveSurveyResultRepositoryStub} from "@/data/test";
import {LoadSurveyResultRepository} from "@/data/protocols/db/survey-result/load-survey-result-repository";
import {makeFakeSurveyResult} from "@/domain/test/mock-survey-result";

type SUTTypes = {
    sut: DbSaveSurveyResult
    saveSurveyResultRepository: SaveSurveyResultRepository
    loadSurveyResultRepository: LoadSurveyResultRepository
}


const makeLoadSurveyResult = (): LoadSurveyResultRepository => {
    return new class implements LoadSurveyResultRepository {
        loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
            return Promise.resolve(makeFakeSurveyResult());
        }
    }
};
const makeSUT = (): SUTTypes => {
    const saveSurveyResultRepository = makeSaveSurveyResultRepositoryStub()
    const loadSurveyResultRepository = makeLoadSurveyResult()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepository, loadSurveyResultRepository)
    return {sut, saveSurveyResultRepository, loadSurveyResultRepository}
}
const makeFakeSurvey = (): SurveyResultModel => <SurveyResultModel>({
    accountId: "any_account_id",
    id: "any_id",
    date: new Date(),
    answers: [
        {answer: "any_answer", percent: 50, count: 1, isCurrentAnswer: true},
        {answer: "other_answer", percent: 50, count: 1, image: "any_image", isCurrentAnswer: false}
    ],
    surveyId: "any_survey_id",
    question: 'any_question'
});
describe("DB Save Survey Result", () => {


    beforeAll(() => {
        mockdate.set(new Date())
    })

    test("Should call repositories correctly", async () => {
        const {sut, saveSurveyResultRepository, loadSurveyResultRepository} = makeSUT();
        const spySaveRepository = jest.spyOn(saveSurveyResultRepository, "save")
        const spyLoadRepository = jest.spyOn(loadSurveyResultRepository, "loadBySurveyId")

        await sut.save({
            accountId: "any_account_id",
            date: new Date(),
            answer: "any_answer",
            surveyId: "any_survey_id"
        });

        expect(spySaveRepository).toHaveBeenCalledWith({
            accountId: "any_account_id",
            date: new Date(),
            answer: "any_answer",
            surveyId: "any_survey_id"
        })
        expect(spyLoadRepository).toHaveBeenCalledWith("any_survey_id", "any_account_id")
    })
    test("Should throw when save repository throws", async () => {
        const {sut, saveSurveyResultRepository} = makeSUT();
        jest.spyOn(saveSurveyResultRepository, "save").mockImplementationOnce(throwError)
        const result = sut.save({
            accountId: "any_account_id",
            date: new Date(),
            answer: "any_answer",
            surveyId: "any_survey_id"
        });

        expect(result).rejects.toThrow()

    })

    test("Should throw when load repository throws", async () => {
        const {sut, loadSurveyResultRepository} = makeSUT();
        jest.spyOn(loadSurveyResultRepository, "loadBySurveyId").mockImplementationOnce(throwError)
        const result = sut.save({
            accountId: "any_account",
            date: new Date(),
            answer: "any_answer",
            surveyId: "any_survey_id"
        });

        expect(result).rejects.toThrow()

    })

    test("Should return a survey result on success", async () => {
        const {sut} = makeSUT();

        const result = await sut.save({
            accountId: "any_account_id",
            date: new Date(),
            answer: "any_answer",
            surveyId: "any_survey_id"
        });

        expect(result).toBeTruthy()
        expect(result.surveyId).toEqual("any_survey_id")
        expect(result.answers).toBeTruthy()
        expect(result.answers[0].answer).toBe("any_answer")
    })
})