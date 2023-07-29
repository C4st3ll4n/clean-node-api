import { Controller, HttpRequest, HttpResponse, Validation } from "../../../protocols";

export class CreateSurveyController implements Controller {

    constructor(private readonly validation:Validation){

    }

    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const isValid = this.validation.validate(httpRequest.body);
        return null;
    }

}