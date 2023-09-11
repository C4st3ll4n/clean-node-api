import {SaveSurveyResultRepository} from "@/data/protocols/db/survey-result/save-survey-result-repository";
import {SaveSurveyResultParam} from "@/domain/usecases/survey-result/save-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {MongoHelper} from "@/infra/db/mongodb/helpers/mongo-helper";
const ObjectId = require("mongodb").ObjectId;

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultParam): Promise<SurveyResultModel> {
        const surveyResultCollection = await MongoHelper.getCollection("surveyResults");
        const ops = await surveyResultCollection.findOneAndUpdate({
            surveyId: new ObjectId(data.surveyId),
            accountId: new ObjectId(data.accountId)
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
            answers: surveyResult.answers,
            accountId: surveyResult.accountId,
            date: surveyResult.date,
            surveyId: surveyResult.surveyId,
            question: surveyResult.question
        };
    }

}