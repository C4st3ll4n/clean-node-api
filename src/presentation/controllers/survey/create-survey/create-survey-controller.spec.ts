import { Controller, HttpRequest, HttpResponse, Validation } from "../../../protocols";
import { CreateSurveyController } from "./create-survey-controller";

const makeValidationStub = ():Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [{ image: "any_image", answer: "any_answer" }],
  },
});

describe("CreateSurvey Controller", () => {
  test("Should call Validation with correct values", async () => {
    const validationStub = makeValidationStub();
    const sut = new CreateSurveyController(validationStub);
    
    const validateSpy = jest.spyOn(validationStub, "validate")
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toBeCalledWith(httpRequest.body)

  });
});
