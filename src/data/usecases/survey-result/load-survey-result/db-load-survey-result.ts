import {LoadSurveyResult} from "@/domain/usecases/survey-result/load-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {LoadSurveyResultRepository} from "@/data/protocols/db/survey-result/load-survey-result-repository";
import {ListSurveyRepository} from "@/data/protocols/db/survey/list-survey-repository";

export class DbLoadSurveyResult implements LoadSurveyResult {


    constructor(private readonly repository: LoadSurveyResultRepository, private readonly loadSurvey: ListSurveyRepository) {
    }

    async load(surveyId: string): Promise<SurveyResultModel> {
        const surveyResult = await this.repository.loadBySurveyId(surveyId);
        if (!surveyResult) {
            const survey = await this.loadSurvey.loadById(surveyId);
            return survey === null ? null : {
                surveyId: survey.id,
                question: survey.question,
                date: survey.date,
                answers: survey.answers.map((a) => {
                    return {
                        answer: a.answer,
                        percent: 0,
                        count: 0,
                        image: a.image
                    };
                })
            }
        }
        return surveyResult;
    }

}