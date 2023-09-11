import {SaveSurveyResultRepository} from "@/data/protocols/db/survey-result/save-survey-result-repository";
import {SaveSurveyResultParam} from "@/domain/usecases/survey-result/save-survey-result";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {MongoHelper} from "@/infra/db/mongodb/helpers/mongo-helper";
import {QueryBuilder} from "@/infra/db/mongodb/helpers/query-builder";

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
                surveyId: new ObjectId(data.surveyId),
                accountId: data.accountId
            }
        }, {
            upsert: true
        });

        //const surveyResult = ops.value;
        const surveyResult = await this.loadBySurveyId(data.surveyId);

        return {
            answers: surveyResult.answers,
            accountId: surveyResult.accountId,
            date: surveyResult.date,
            surveyId: surveyResult.surveyId,
            question: surveyResult.question
        };
    }

    private async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
        const surveyResultCollection = await MongoHelper.getCollection("surveyResults");

        const query = new QueryBuilder()
            .match({
                "surveyId": new ObjectId(`${surveyId}`)
            })
            .group({
                "_id": 0,
                "data": {
                    "$push": "$$ROOT"
                },
                "count": {
                    "$sum": 1
                }
            })
            .unwind({
                "path": "$data"
            })
            .lookup({
                "from": "surveys",
                "localField": "data.surveyId",
                "foreignField": "_id",
                "as": "survey"
            })
            .unwind({
                "path": "$survey"
            })
            .group({
                "_id": {
                    "surveyId": "$data.surveyId",
                    "question": "$survey.question",
                    "date": "$survey.date",
                    "total": "$count",
                    "answer": {
                        "$filter": {
                            "input": "$survey.answers",
                            "as": "item",
                            "cond": {
                                "$eq": [
                                    "$$item.answer",
                                    "$data.answer"
                                ]
                            }
                        }
                    }
                },"count": {
                    "$sum": 1
                }
            })
            .unwind({
                "path": "$_id.answer"
            })
            .addFields({

                "_id.answer.percent": {
                    $multiply: [{
                        $divide: ["$count", "$_id.total"]
                    }, 100]

                },
                "_id.answer.count": "$count"
            })
            .group({
                "_id": {
                    "surveyId": "$_id.surveyId",
                    "question": "$_id.question",
                    "date": "$_id.date"
                },
                "answers": {
                    "$push": "$_id.answer"
                }
            })
            .project({
                "_id": 0,
                "surveyId": "$_id.surveyId",
                "question": "$_id.question",
                "date": "$_id.date",
                "answers": "$answers"
            })
            .build();

        const resultQuery = surveyResultCollection.aggregate(query);


        const surveyResult = await resultQuery.toArray();

        return surveyResult?.length ? surveyResult[0] : null
    }

}