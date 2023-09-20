import {
    SaveSurveyResultController
} from "@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller";
import {LoadSurveyById} from "@/domain/usecases/survey/load-survey-by-id";
import {SurveyModel} from "@/domain/models/survey";
import {badRequest, ok, serverError} from "@/presentation/helpers/http/http-helper";
import {SaveSurveyResult} from "@/domain/usecases/survey-result/save-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {InvalidParamError} from "@/presentation/errors";
import mockdate from "mockdate";
import {makeFakeSurveyResult} from "@/domain/test/mock-survey-result";

type SUTTypes = {
    sut: SaveSurveyResultController,
    loadSurveyStub: LoadSurveyById,
    saveSurveyResult: SaveSurveyResult
}

const makeSurveyModel = (): SurveyModel => {
    return {
        id: "any_survey_id",
        date: new Date(),
        question: "any_question",
        answers: [
            {image: "any_image", answer: "any_answer"},
            {image: "other_image", answer: "other_answer"},
        ]
    };
};
const makeLoadSurveyStub = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById(id: string): Promise<SurveyModel> {
            return Promise.resolve(makeSurveyModel());
        }
    }

    return new LoadSurveyByIdStub();
};
const makeSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
        async save(data: SaveSurveyResult.Param): Promise<SaveSurveyResult.Result> {
            return Promise.resolve(makeFakeSurveyResult());
        }
    }

    return new SaveSurveyResultStub();
};

const makeSut = (): SUTTypes => {
    const loadSurveyStub = makeLoadSurveyStub()
    const saveSurveyResult = makeSaveSurveyResult()
    const sut = new SaveSurveyResultController(loadSurveyStub, saveSurveyResult)
    return {
        sut,
        loadSurveyStub,
        saveSurveyResult
    }
}

const makeRequest = (): SaveSurveyResultController.Request => {
    return {
        surveyId: "any_survey_id",
        answer: "any_answer",
        accountId: "any_account_id",

    };
};
describe("Save SurveyResult Controller", () => {

    beforeAll(() => {
        mockdate.set(new Date())
    })

    describe("LoadSurveyById", () => {
        test("should call LoadSurveyById correctly", async () => {
            const {sut, loadSurveyStub} = makeSut();
            const spy = jest.spyOn(loadSurveyStub, "loadById")
            await sut.handle(makeRequest())
            expect(spy).toHaveBeenCalledWith("any_survey_id")
        })

        test("should return 403 when LoadSurveyById returns null", async () => {
            const {sut, loadSurveyStub} = makeSut();
            jest.spyOn(loadSurveyStub, "loadById").mockReturnValueOnce(null)
            const response = await sut.handle(makeRequest())
            expect(response.statusCode).toEqual(403)
        })

        test("should return 500 when LoadSurveyById throws", async () => {
            const {sut, loadSurveyStub} = makeSut();
            jest.spyOn(loadSurveyStub, "loadById").mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

            const httpResponse = await sut.handle(makeRequest());
            expect(httpResponse).toEqual(serverError(new Error()));
        })
    })

    describe("SaveSurveyResult", () => {
        test("should call SaveSurveyResult correctly", async () => {
            const {sut, saveSurveyResult} = makeSut();
            const spy = jest.spyOn(saveSurveyResult, "save")
            await sut.handle(makeRequest())
            expect(spy).toHaveBeenCalledWith({
                "accountId": "any_account_id",
                "answer": "any_answer",
                "date": new Date(),
                "surveyId": "any_survey_id",

            })
        })

        test("should return 400 when SaveSurveyResult returns null", async () => {
            const {sut, saveSurveyResult} = makeSut();
            jest.spyOn(saveSurveyResult, "save").mockReturnValueOnce(null)
            const response = await sut.handle(makeRequest())
            expect(response.statusCode).toEqual(400)
        })

        test("should return 500 when SaveSurveyResult throws", async () => {
            const {sut, saveSurveyResult} = makeSut();
            jest.spyOn(saveSurveyResult, "save").mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

            const httpResponse = await sut.handle(makeRequest());
            expect(httpResponse).toEqual(serverError(new Error()));
        })

        test("should return 200 on success", async () => {
            const {sut} = makeSut();

            const httpResponse = await sut.handle(makeRequest());
            expect(httpResponse).toEqual(ok(makeFakeSurveyResult()));
        })

    })
    test("Should return 403 when invalid answer is provided", async () => {
        const {sut} = makeSut();
        const response = await sut.handle({
            surveyId: "any_survey_id",
            accountId: "any_account_id",
            answer: "wrong answer"
        })
        expect(response.statusCode).toEqual(400)
        expect(response).toEqual(badRequest(new InvalidParamError("answer")))
    })

})