import {
    SaveSurveyResultController
} from "@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller";
import {HttpRequest} from "@/presentation/protocols";
import {LoadSurveyById} from "@/domain/usecases/survey/load-survey-by-id";
import {SurveyModel} from "@/domain/models/survey";

type SUTTypes = {
    sut: SaveSurveyResultController,
    loadSurveyStub: LoadSurveyById
}

const makeSurveyModel = ():SurveyModel => {
    return {
        id: "any_id",
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
      loadById(id: string): Promise<SurveyModel> {
          return Promise.resolve(makeSurveyModel());
      }
  }

  return new LoadSurveyByIdStub();
};
const makeSut = ():SUTTypes=>{
    const loadSurveyStub = makeLoadSurveyStub()
    const sut = new SaveSurveyResultController(loadSurveyStub)
    return {
        sut,
        loadSurveyStub
    }
}

const makeRequest = ():HttpRequest => {
    return {
        params:{
            surveyId: "any_id"
        }
    };
};
describe("Save SurveyResult Controller", ()=>{
    test("should call LoadSurveyById correctly", async () => {
        const {sut, loadSurveyStub} = makeSut();
        const spy = jest.spyOn(loadSurveyStub, "loadById")
        await sut.handle(makeRequest())
        expect(spy).toHaveBeenCalledWith("any_id")
    })

    test("should return 403 when LoadSurveyById returns null", async () => {
        const {sut, loadSurveyStub} = makeSut();
        jest.spyOn(loadSurveyStub, "loadById").mockReturnValueOnce(null)
        const response = await sut.handle(makeRequest())
        expect(response.statusCode).toEqual(403)
    })
})