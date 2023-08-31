import {
    SaveSurveyResultController
} from "@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller";
import {HttpRequest} from "@/presentation/protocols";
import {LoadSurveyById} from "@/domain/usecases/survey/load-survey-by-id";
import {SurveyModel} from "@/domain/models/survey";
import {badRequest, forbidden, serverError} from "@/presentation/helpers/http/http-helper";
import {SaveSurveyResult, SaveSurveyResultModel} from "@/domain/usecases/survey-result/save-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {InvalidParamError} from "@/presentation/errors";
import {LoadAccountByToken} from "@/domain/usecases/account/load-account-by-token";
import {AccountModel} from "@/domain/models/account";

type SUTTypes = {
    sut: SaveSurveyResultController,
    loadSurveyStub: LoadSurveyById,
    saveSurveyResult: SaveSurveyResult
}

const makeSurveyModel = ():SurveyModel => {
    return {
        id: "any_survey_id",
        date: new Date(),
        question: "any_question",
        answers: [
            {image:"any_image", answer:"any_answer"},
            {image:"other_image", answer:"other_answer"},
        ]
    };
};
const makeLoadSurveyStub = ():LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById{
      async loadById(id: string): Promise<SurveyModel> {
          return Promise.resolve(makeSurveyModel());
      }
  }

  return new LoadSurveyByIdStub();
};
const makeSurveyResult = (): SurveyResultModel => ({
    id: "any_id",
    answer: "any_answer",
    surveyId: "any_survey_id",
    date: new Date(),
    accountId: "any_account_id"
});
const makeSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
        async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
            return Promise.resolve(makeSurveyResult());
        }
    }

    return new SaveSurveyResultStub();
};

const makeAccount = (): AccountModel => ({
    id: "any_account_id",
    email: "any_email",
    name: "any_name",
    password: "any_password"
});
const makeLoadAccount = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async loadByToken(token: string, role?: string): Promise<AccountModel> {
            return Promise.resolve(makeAccount());
        }
    }

    return new LoadAccountByTokenStub();
};
const makeSut = ():SUTTypes=>{
    const loadSurveyStub = makeLoadSurveyStub()
    const saveSurveyResult = makeSaveSurveyResult()
    const loadAccountByToken = makeLoadAccount()
    const sut = new SaveSurveyResultController(loadSurveyStub, saveSurveyResult, loadAccountByToken)
    return {
        sut,
        loadSurveyStub,
        saveSurveyResult
    }
}

const makeRequest = ():HttpRequest => {
    return {
        params:{
            surveyId: "any_survey_id"
        },
        body: {
            answer: "any_answer"
        }
    };
};
describe("Save SurveyResult Controller", ()=>{
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
            expect(response.statusCode).toEqual(403)
        })

        test("should return 500 when SaveSurveyResult throws", async () => {
            const {sut, saveSurveyResult} = makeSut();
            jest.spyOn(saveSurveyResult, "save").mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

            const httpResponse = await sut.handle(makeRequest());
            expect(httpResponse).toEqual(serverError(new Error()));
        })

    })
    test("Should return 403 when invalid answer is provided", async () => {
        const {sut} = makeSut();
        const response = await sut.handle({
            params: {
                survey_id: "any_survey_id"
            },
            body: {
                answer: "wrong answer"
            }
        })
        expect(response.statusCode).toEqual(400)
        expect(response).toEqual(badRequest(new InvalidParamError("answer")))
    })

})