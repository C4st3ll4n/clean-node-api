import {SaveSurveyResultRepository} from "@/data/protocols/db/survey-result/save-survey-result-repository";
import {SaveSurveyResultModel} from "@/domain/usecases/survey-result/save-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {MongoHelper} from "@/infra/db/mongodb/helpers/mongo-helper";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        const surveyResultCollection = await MongoHelper.getCollection("surveyResults");
        const ops = await surveyResultCollection.findOneAndUpdate({
            surveyId: data.surveyId,
            accountId: data.accountId
        }, {
            $set: {
                answer: data.answer,
                date: data.date,
                surveyId: data.surveyId,
                accountId: data.accountId
            }
        }, {
            upsert: true,
            returnOriginal: false
        });

        const surveyResult = ops.value;
        return {
            id: surveyResult._id,
            answer: surveyResult.answer,
            accountId: surveyResult.accountId,
            date: surveyResult.date,
            surveyId: surveyResult.surveyId
        };
    }

}