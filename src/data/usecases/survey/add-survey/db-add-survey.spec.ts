import { AddSurveyParam, AddSurveyRepository } from "./db-add-survey-protocols";
import { DbAddSurvey } from "./db-add-survey";
import * as mockdate from "mockdate";
import {throwError} from "@/domain/test";
import {makeAddSurveyRepositoryStub} from "@/data/test";
type SUTTypes = {
  sut: DbAddSurvey;
  addSurveyRepository: AddSurveyRepository;
}

const makeFakeSurvey = (): AddSurveyParam => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date()
});

const makeSUT = (): SUTTypes => {
  const addSurveyRepository = makeAddSurveyRepositoryStub();

  const sut = new DbAddSurvey(addSurveyRepository);
  return { sut, addSurveyRepository };
};

describe("DbAddSurvey Usecase", () => {

  beforeAll(()=>{
    mockdate.set(new Date())
  })

  test("Should call AddSurveyRepository with correct values", async () => {
    const { sut, addSurveyRepository } = makeSUT();

    const spyAdd = jest.spyOn(addSurveyRepository, "add");

    await sut.add(makeFakeSurvey());

    expect(spyAdd).toBeCalledWith(makeFakeSurvey());
  });

  test("Should thorw when AddSurveyRepository throws", async () => {
    const { sut, addSurveyRepository } = makeSUT();

    jest.spyOn(addSurveyRepository, "add").mockImplementationOnce(throwError)
    const err = sut.add(makeFakeSurvey());

    await expect(err).rejects.toThrow();
  });
});
