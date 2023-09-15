import {ListSurvey} from "@/domain/usecases/survey/list-survey";
import {SurveyModel} from "@/domain/models/survey";
import {ListSurveysController} from "./list-surveys-controller";
import * as mockdate from "mockdate";
import {serverError} from "../../../helpers/http/http-helper";
import {makeFakeSurvey} from "@/domain/test";
import {HttpRequest} from "@/presentation/protocols";

type SUTTypes ={
    sut: ListSurveysController,
    listSurveys: ListSurvey
}


const makeListSurveyStub = (): ListSurvey =>
    new class implements ListSurvey {
        getAll(): Promise<SurveyModel[]> {
            return Promise.resolve([
                makeFakeSurvey()
            ]);
        }
    };
const makeSUT = (): SUTTypes => {
    const listSurveys = makeListSurveyStub()
    const sut = new ListSurveysController(listSurveys)
    return {sut, listSurveys}
}
const httpRequest: ListSurveysController.Request = {
    accountId: "any_account_id"
};
describe("ListSurveys Controller", () => {

    beforeAll(()=>{
        mockdate.set(new Date());
    })

    test("Should call ListSurvey correctly", async () => {
        const {sut, listSurveys} = makeSUT()
        const loadSpy = jest.spyOn(listSurveys, "getAll")
        await sut.handle(httpRequest)
        expect(loadSpy).toHaveBeenCalled()
    })

    test("Should return a valid 200 with survey list", async()=>{

        const {sut} = makeSUT()
        const listReponse = await sut.handle(httpRequest)

        expect(listReponse.statusCode).toEqual(200)
        expect(listReponse.body).toBeTruthy()
        expect(listReponse.body[0]).toBeTruthy()
        expect(listReponse.body[0].id).toEqual("any_survey_id")

    })

    test("Should return 500 when ListSurvey throws", async () => {
        const {sut, listSurveys} = makeSUT()
        jest.spyOn(listSurveys, "getAll").mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())));
        const promise = await sut.handle(httpRequest)
        expect(promise).toEqual(serverError(new Error()))
    })

    test("Should return a 404 with survey list empty", async()=>{

        const {sut, listSurveys} = makeSUT()
        jest.spyOn(listSurveys, "getAll").mockReturnValueOnce(Promise.resolve([]));
        const listReponse = await sut.handle(httpRequest)

        expect(listReponse.statusCode).toEqual(404)

    })
})