import {Controller, HttpRequest, HttpResponse} from "@/presentation/protocols";
import {LoadSurveyById} from "@/domain/usecases/survey/load-survey-by-id";
import {badRequest, forbidden, ok, serverError} from "@/presentation/helpers/http/http-helper";
import {InvalidParamError} from "@/presentation/errors";
import {SaveSurveyResult} from "@/domain/usecases/survey-result/save-survey-result";

export class SaveSurveyResultController implements Controller{

    constructor(private readonly loadSurvey: LoadSurveyById,
                private readonly saveResult: SaveSurveyResult) {
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
                const saveSurveyResult = await this.saveResult.save({
                    surveyId:surveyId,
                    answer:answer,
                    date: new Date(),
                    accountId: httpRequest.accountId
                })
                if(!saveSurveyResult){
                    return badRequest(new Error("Something went wrong, try again later."))
                }

                return ok(saveSurveyResult);
            } else {
                return forbidden(new InvalidParamError("surveyId"));
            }

        } catch (e) {
            return serverError(e)
        }

    }

}