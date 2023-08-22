import {ListSurveyRepository} from "../../protocols/db/survey/list-survey-repository";
import {SurveyModel} from "@/domain/models/survey";
import {DBListSurvey} from "./db-list-survey";
import * as mockdate from "mockdate";

interface SUTTypes {
    sut: DBListSurvey
    repository: ListSurveyRepository
}

const makeFakeSurvey = (): SurveyModel => <SurveyModel>({
    question: "any_question",
    answers: [
        {
            image: "any_image",
            answer: "any_answer"
        }
    ],
    id: "any_id",
    date: new Date()
});
const makeRepositoryStub = (): ListSurveyRepository => {
    class ListSurveyRepositoryStub implements ListSurveyRepository {
        async all(): Promise<SurveyModel[]> {
            return Promise.resolve([
                makeFakeSurvey()
            ]);
        }

        load(accountId: string): Promise<SurveyModel[]> {
            return Promise.resolve([
                makeFakeSurvey()
            ]);
        }
    }

    return new ListSurveyRepositoryStub();
};
const makeSUT = (): SUTTypes => {
    const repository = makeRepositoryStub()
    const sut = new DBListSurvey(repository)
    return {sut, repository}
}

describe("DbListSurvey Usecase", () => {

    beforeAll(() => {
        mockdate.set(new Date())
    })

    test("Should call ListSurveyRepository correctly", async () => {
        const {sut, repository} = makeSUT()
        const spyRepository = jest.spyOn(repository, "all")
        await sut.getAll();

        expect(spyRepository).toHaveBeenCalled()
    })

    test("Should return a valid list from ListSurveyRepository", async () => {
        const {sut} = makeSUT()
        const listReponse = await sut.getAll();
        expect(listReponse).toBeTruthy()
        expect(listReponse[0]).toBeTruthy()
        expect(listReponse[0].id).toEqual("any_id")
    })

    test("Should throw when ListSurveyRepository throws", () => {
        const {sut, repository} = makeSUT();
        jest.spyOn(repository, "all").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
        const result = sut.getAll();

        expect(result).rejects.toThrow()
    })
})