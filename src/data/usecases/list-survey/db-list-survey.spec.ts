import {ListSurveyRepository} from "../../protocols/db/survey/list-survey-repository";
import {SurveyModel} from "../../../domain/models/survey";
import {DBListSurvey} from "./db-list-survey";

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
    }

    return new ListSurveyRepositoryStub();
};
const makeSUT = (): SUTTypes => {
    const repository = makeRepositoryStub()
    const sut = new DBListSurvey(repository)
    return {sut, repository}
}

describe("DbListSurvey Usecase", () => {
    test("Should call ListSurveyRepository correctly", async () => {
        const {sut, repository} = makeSUT()
        const spyRepository = jest.spyOn(repository, "all")
        await sut.getAll();

        expect(spyRepository).toHaveBeenCalled()
    })
})