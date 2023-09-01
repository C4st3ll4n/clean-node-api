import {DbSaveSurveyResult} from "@/data/usecases/survey-result/save-survey-result/db-save-survey-result";
import {SaveSurveyResultRepository} from "@/data/protocols/db/survey-result/save-survey-result-repository";
import {SurveyResultModel} from "@/domain/models/survey-result";
import mockdate from "mockdate";
import {throwError} from "@/domain/test";
import {makeSaveSurveyResultRepositoryStub} from "@/data/test";

type SUTTypes = {
    sut: DbSaveSurveyResult
    repository: SaveSurveyResultRepository
}


const makeSUT = (): SUTTypes => {
    const repository = makeSaveSurveyResultRepositoryStub()
    const sut = new DbSaveSurveyResult(repository)
    return {sut, repository}
}
const makeFakeSurvey = (): SurveyResultModel => <SurveyResultModel>({
    accountId: "any_account",
    id: "any_id",
    date: new Date(),
    answer: "any_answer",
    surveyId: "any_survey_id"
});
describe("DB Save Survey Result", () => {


    beforeAll(() => {
        mockdate.set(new Date())
    })

    test("Should call repository correctly", async () => {
        const {sut, repository} = makeSUT();
        const spyRepository = jest.spyOn(repository, "save")
        await sut.save({
            accountId: "any_account",
            date: new Date(),
            answer: "any_answer",
            surveyId: "any_survey_id"
        });

        expect(spyRepository).toHaveBeenCalledWith({
            accountId: "any_account",
            date: new Date(),
            answer: "any_answer",
            surveyId: "any_survey_id"
        })
    })
    test("Should throw when repository throws", async () => {
        const {sut, repository} = makeSUT();
        jest.spyOn(repository, "save").mockImplementationOnce(throwError)
        const result = sut.save({
            accountId: "any_account",
            date: new Date(),
            answer: "any_answer",
            surveyId: "any_survey_id"
        });

        expect(result).rejects.toThrow()

    })
})