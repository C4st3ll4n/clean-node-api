import {Controller, HttpRequest, HttpResponse} from "@/presentation/protocols";
import {LoadSurveyById} from "@/domain/usecases/survey/load-survey-by-id";
import {forbidden, ok} from "@/presentation/helpers/http/http-helper";
import {AccessDeniedError} from "@/presentation/errors";

export class SaveSurveyResultController implements Controller{

    constructor(private readonly loadSurvey: LoadSurveyById) {
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const survey = await this.loadSurvey.loadById(httpRequest.params.surveyId)
        if(!survey){
            return forbidden(new AccessDeniedError());
        }
        return null
    }

}