import { badRequest, serverError } from "../../../helpers/http/http-helper";
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

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);
    if (error) {
      return badRequest(error);
    }

    const { question, answers } = httpRequest.body;
    try {
      await this.addSurvey.add({
        question,
        answers,
      });

      return null;
    } catch (error) {
      return serverError(error);
    }
  }
}
