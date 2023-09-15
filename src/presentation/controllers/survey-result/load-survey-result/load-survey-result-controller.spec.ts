import {HttpRequest} from "@/presentation/protocols";
import {LoadSurveyById} from "@/domain/usecases/survey/load-survey-by-id";
import {badRequest, ok, serverError} from "@/presentation/helpers/http/http-helper";
import {InvalidParamError} from "@/presentation/errors";
import mockdate from "mockdate";
import {makeFakeSurveyResult} from "@/domain/test/mock-survey-result";
import {
    LoadSurveyResultController
} from "@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller";
import {LoadSurveyResult} from "@/domain/usecases/survey-result/load-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {throwError} from "@/domain/test";

type SUTTypes = {
    sut: LoadSurveyResultController,
    loadSurveyResultStub: LoadSurveyResult,
}

const mockLoadSurveyResult = () : LoadSurveyResult => {
    return new class LoadSurveyResultSub implements LoadSurveyResult{
        async load(surveyId:string, accountId): Promise<SurveyResultModel> {
            return Promise.resolve(makeFakeSurveyResult());
        }
    }
};
const makeSut = (): SUTTypes => {
    const loadSurveyResultStub = mockLoadSurveyResult();
    const sut = new LoadSurveyResultController(loadSurveyResultStub)
    return {
        sut,
        loadSurveyResultStub,
    }
}

const makeRequest = (): LoadSurveyResultController.Request => {
    return {
        surveyId: "any_survey_id",
        accountId: "any_account_id",
    };
};
describe("Load Survey Result Controller", () => {

    beforeAll(() => {
        mockdate.set(new Date())
    })

    describe("Load Survey Result", () => {
        test("should call LoadSurveyById correctly", async () => {
            const {sut, loadSurveyResultStub} = makeSut();
            const spy = jest.spyOn(loadSurveyResultStub, "load")
            await sut.handle(makeRequest())
            expect(spy).toHaveBeenCalledWith("any_survey_id", "any_account_id")
        })

        test("should return 404 when LoadSurveyById returns null", async () => {
            const {sut, loadSurveyResultStub} = makeSut();
            jest.spyOn(loadSurveyResultStub, "load").mockReturnValueOnce(null)
            const response = await sut.handle(makeRequest())
            expect(response.statusCode).toEqual(404)
        })

        test("should return 500 when LoadSurveyById throws", async () => {
            const {sut, loadSurveyResultStub} = makeSut();
            jest.spyOn(loadSurveyResultStub, "load").mockImplementationOnce(throwError);
            const httpResponse = await sut.handle(makeRequest());
            expect(httpResponse).toEqual(serverError(new Error()));
        })

        test("should return an survey result on success", async () => {
            const {sut} = makeSut();
            const {body, statusCode} = await sut.handle(makeRequest());

            expect(statusCode).toBe(200)
            expect(body).toBeTruthy()
            expect(body.surveyId).toEqual("any_survey_id")
            expect(body.answers).toBeTruthy()
        })
    })
})