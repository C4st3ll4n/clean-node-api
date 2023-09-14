import {ListSurveyRepository} from "@/data/protocols/db/survey/list-survey-repository";
import {DBListSurvey} from "./db-list-survey";
import * as mockdate from "mockdate";
import {throwError} from "@/domain/test";
import {makeListSurveyRepositoryStub} from "@/data/test";

type SUTTypes = {
    sut: DBListSurvey
    repository: ListSurveyRepository
}


const makeSUT = (): SUTTypes => {
    const repository = makeListSurveyRepositoryStub()
    const sut = new DBListSurvey(repository)
    return {sut, repository}
}

describe("DbListSurvey Usecase", () => {

    beforeAll(() => {
        mockdate.set(new Date())
    })

    describe("ListSurveys", ()=>{

        test("Should call ListSurveyRepository correctly", async () => {
            const {sut, repository} = makeSUT()
            const spyRepository = jest.spyOn(repository, "loadByAccountID")
            await sut.getAll("any_account_id");

            expect(spyRepository).toHaveBeenCalledWith("any_account_id")
        })

        test("Should return a valid list from ListSurveyRepository", async () => {
            const {sut} = makeSUT()
            const listReponse = await sut.getAll("any_account_id");
            expect(listReponse).toBeTruthy()
            expect(listReponse[0]).toBeTruthy()
            expect(listReponse[0].id).toEqual("any_survey_id")
        })

        test("Should throw when ListSurveyRepository throws", () => {
            const {sut, repository} = makeSUT();
            jest.spyOn(repository, "loadByAccountID").mockImplementationOnce(throwError)
            const result = sut.getAll("any_account_id");

            expect(result).rejects.toThrow()
        })
    })

    describe("LoadSurveyById", ()=>{

        test("Should call LoadSurveyById correctly", async () => {
            const {sut, repository} = makeSUT()
            const spyRepository = jest.spyOn(repository, "loadById")
            await sut.loadById("any_survey_id");

            expect(spyRepository).toHaveBeenCalled()
        })

        test("Should return a valid survey", async () => {
            const {sut} = makeSUT()
            const response = await sut.loadById("any_survey_id");
            expect(response).toBeTruthy()
            expect(response.id).toBeTruthy()
            expect(response.id).toEqual("any_survey_id")
        })


        test("Should throw when LoadSurveyById throws", () => {
            const {sut, repository} = makeSUT();
            jest.spyOn(repository, "loadById").mockImplementationOnce(throwError)
            const result = sut.loadById("any_survey_id");

            expect(result).rejects.toThrow()
        })
    })

})