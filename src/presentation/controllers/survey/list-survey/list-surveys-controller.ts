import {Controller, HttpRequest, HttpResponse} from "../../../protocols";
import {ListSurvey} from "@/domain/usecases/survey/list-survey";
import {notFound, ok, serverError} from "../../../helpers/http/http-helper";

export class ListSurveysController implements Controller {

    constructor(private readonly listSurveys: ListSurvey) {
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const surveys = await this.listSurveys.getAll(httpRequest.accountId);
            if (surveys.length === 0) {
                return notFound("No survey found")
            }
            return ok(surveys);
        } catch (e) {
            return serverError(e);
        }

    }

}