import {Controller, HttpResponse} from "@/presentation/protocols";
import {notFound, ok, serverError} from "@/presentation/helpers/http/http-helper";
import {LoadSurveyResult} from "@/domain/usecases/survey-result/load-survey-result";

export class LoadSurveyResultController implements Controller {

    constructor(private readonly loadSurveyResult: LoadSurveyResult) {
    }

    async handle(httpRequest: LoadSurveyResultController.Request): Promise<HttpResponse> {
        try {
            const {surveyId, accountId} = httpRequest;
            const surveyResult = await this.loadSurveyResult.load(surveyId, accountId)
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

export namespace LoadSurveyResultController {
    export type Request = {
        surveyId: string,
        accountId: string
    }
}