import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from "../../../protocols";
import { CreateSurveyController } from "./create-survey-controller";
import { badRequest} from "../../../helpers/http/http-helper";

interface SUTTypes {
  sut: Controller;
  validationStub: Validation;
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [{ image: "any_image", answer: "any_answer" }],
  },
});

const makeSut = (): SUTTypes => {
  const validationStub = makeValidationStub();
  const sut = new CreateSurveyController(validationStub);

  return {
    sut,
    validationStub,
  };
};

describe("CreateSurvey Controller", () => {
  test("Should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toBeCalledWith(httpRequest.body);
  });

  test("Should return 400 when Validation fails", async () => {
    const { sut, validationStub } = makeSut();

    jest.spyOn(validationStub, "validate").mockImplementationOnce(()=>{
      return new Error("")
    });
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new Error("")))
  });
});
