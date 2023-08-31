import {Controller, HttpRequest, HttpResponse} from "@/presentation/protocols";
import {LoadSurveyById} from "@/domain/usecases/survey/load-survey-by-id";
import {badRequest, forbidden, serverError} from "@/presentation/helpers/http/http-helper";
import {AccessDeniedError, InvalidParamError} from "@/presentation/errors";
import {SaveSurveyResult} from "@/domain/usecases/survey-result/save-survey-result";
import {LoadAccountByToken} from "@/domain/usecases/account/load-account-by-token";

export class SaveSurveyResultController implements Controller{

    constructor(private readonly loadSurvey: LoadSurveyById,
                private readonly saveResult: SaveSurveyResult,
                private readonly loadAccountToken: LoadAccountByToken) {
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const {surveyId} = httpRequest.params;
            const {answer} = httpRequest.body;

            const survey = await this.loadSurvey.loadById(surveyId)

            if (survey) {
                const answers = survey.answers.map(a => a.answer);
                if (!answers.includes(answer)) {
                    return badRequest(new InvalidParamError("answer"));
                }
            } else {
                return forbidden(new InvalidParamError("surveyId"));
            }
            return null

        } catch (e) {
            return serverError(e)
        }

    }

}