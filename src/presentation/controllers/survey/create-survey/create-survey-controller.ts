import { badRequest, noContent, serverError } from "../../../helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from "../../../protocols";
import { AddSurvey } from "./create-survey-protocols";

export class CreateSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(httpRequest: CreateSurveyController.Request): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest);
    if (error) {
      return badRequest(error);
    }

    const { question, answers } = httpRequest;
    try {
      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      });

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace CreateSurveyController {
  export type Request = {
    question: string
    answers: Answer[]
  }

  type Answer = {
    image?: string
    answer: string
  }
}
