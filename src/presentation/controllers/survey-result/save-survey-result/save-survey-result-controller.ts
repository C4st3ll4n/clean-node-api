import {Controller, HttpRequest, HttpResponse} from "@/presentation/protocols";
import {LoadSurveyById} from "@/domain/usecases/survey/load-survey-by-id";
import {forbidden} from "@/presentation/helpers/http/http-helper";
import {AccessDeniedError, InvalidParamError} from "@/presentation/errors";

export class SaveSurveyResultController implements Controller{

    constructor(private readonly loadSurvey: LoadSurveyById) {
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const survey = await this.loadSurvey.loadById(httpRequest.params.surveyId)
        if(!survey){
            return forbidden(new InvalidParamError("surveyId"));
        }
        return null
    }

}