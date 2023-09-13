import {Controller, HttpRequest, HttpResponse} from "@/presentation/protocols";
import {notFound, ok, serverError} from "@/presentation/helpers/http/http-helper";
import {LoadSurveyResult} from "@/domain/usecases/survey-result/load-survey-result";

export class LoadSurveyResultController implements Controller{

    constructor(private readonly loadSurveyResult: LoadSurveyResult) {
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const {surveyId} = httpRequest.params;
            const surveyResult = await this.loadSurveyResult.load(surveyId)
            if (surveyResult) {
                return ok(surveyResult);
            } else {
                return notFound("Survey not found");
            }
        } catch (e) {
            return serverError(e);
        }

    }

}