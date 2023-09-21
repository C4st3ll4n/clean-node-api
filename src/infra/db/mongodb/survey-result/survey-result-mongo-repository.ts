import {SaveSurveyResultRepository} from "@/data/protocols/db/survey-result/save-survey-result-repository";
import {SurveyResultModel} from "@/domain/models/survey-result";
import {MongoHelper} from "@/infra/db/mongodb/helpers/mongo-helper";
import {QueryBuilder} from "@/infra/db/mongodb/helpers/query-builder";
import {LoadSurveyResultRepository} from "@/data/protocols/db/survey-result/load-survey-result-repository";

const ObjectId = require("mongodb").ObjectId;

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
    async save(data: SaveSurveyResultRepository.Param): Promise<void> {
        const surveyResultCollection = MongoHelper.getCollection("surveyResults");
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

    }

    async loadBySurveyId(surveyId: string, accountId: string): Promise<SurveyResultModel> {
        const surveyResultCollection = MongoHelper.getCollection("surveyResults");

        const query = new QueryBuilder()
            .match({
                "surveyId": new ObjectId(`${surveyId}`)
            })
            .group({
                "_id" : 0,
                "data" : {
                    "$push" : "$$ROOT"
                },
                "total" : {
                    "$sum" :1
                }
            })
            .unwind({
                "path" : "$data"
            })
            .lookup({
                "from" : "surveys",
                "localField" : "data.surveyId",
                "foreignField" : "_id",
                "as" : "survey"
            })
            .unwind({
                "path" : "$survey"
            })
            .group({
                "_id" : {
                    "surveyId" : "$data.surveyId",
                    "question" : "$survey.question",
                    "date" : "$survey.date",
                    "total" : "$total",
                    "answer" : "$data.answer",
                    "answers" : "$survey.answers"
                },
                "count" : {
                    "$sum" : 1
                },
                currentAccountAnswer: {
                    $push: {
                        $cond: [{
                            $eq:['$data.accountId', accountId]
                        },'$data.answer',null]
                    }
                }
            })
            .project({
                "_id" : 0,
                "surveyId" : "$_id.surveyId",
                "question" : "$_id.question",
                "date" : "$_id.date",
                "answers" : {
                    "$map" : {
                        "input" : "$_id.answers",
                        "as" : "item",
                        "in" : {
                            "$mergeObjects" : [
                                "$$item",
                                {
                                    "count" : {
                                        "$cond" : {
                                            "if" : {
                                                "$eq" : [
                                                    "$$item.answer",
                                                    "$_id.answer"
                                                ]
                                            },
                                            "then" : "$count",
                                            "else" : 0
                                        }
                                    },
                                    "percent" : {
                                        "$cond" : {
                                            "if" : {
                                                "$eq" : [
                                                    "$$item.answer",
                                                    "$_id.answer"
                                                ]
                                            },
                                            "then" : {
                                                "$multiply" : [
                                                    {
                                                        "$divide" : [
                                                            "$count",
                                                            "$_id.total"
                                                        ]
                                                    },
                                                    100
                                                ]
                                            },
                                            "else" : 0
                                        }
                                    },
                                    "isCurrentAnswer": {
                                        $eq:['$$item.answer', {
                                            $arrayElemAt: ["$currentAccountAnswer", 0]
                                        }]
                                    }
                                }
                            ]
                        }
                    }
                }
            })
            .group({
                "_id" : {
                    "surveyId" : "$surveyId",
                    "question" : "question",
                    "date" : "$date"
                },
                "answers" : {
                    "$push" : "$answers"
                }
            })
            .project({
                "_id" : (0),
                "surveyId" : "$_id.surveyId",
                "question" : "$_id.question",
                "date" : "$_id.date",
                "answers" : {
                    "$reduce" : {
                        "input" : "$answers",
                        "initialValue" : [

                        ],
                        "in" : {
                            "$concatArrays" : [
                                "$$value",
                                "$$this"
                            ]
                        }
                    }
                }
            })
            .unwind({
                "path" : "$answers"
            })
            .group({
                "_id" : {
                    "surveyId" : "$surveyId",
                    "question" : "$question",
                    "date" : "$date",
                    "answer" : "$answers.answer",
                    "image" : "$answers.image",
                    "isCurrentAnswer" : "$answers.isCurrentAnswer"
                },
                "count" : {
                    "$sum" : "$answers.count"
                },
                "percent" : {
                    "$sum" : "$answers.percent"
                }
            })
            .project({
                "_id" : (0),
                "surveyId" : "$_id.surveyId",
                "question" : "$_id.question",
                "date" : "$_id.date",
                "answers" : {
                    "answer" : "$_id.answer",
                    "image" : "$_id.image",
                    "count" : "$count",
                    "percent" : "$percent",
                    "isCurrentAnswer" : "$_id.isCurrentAnswer"
                }
            })
            .sort({
                "answers.count" : (-1)
            })
            .group({
                "_id" : {
                    "surveyId" : "$surveyId",
                    "question" : "$question",
                    "date" : "$date"
                },
                "answers" : {
                    "$push" : "$answers"
                }
            })
            .project({
                "_id" : (0),
                "surveyId" : "$_id.surveyId",
                "question" : "$_id.question",
                "date" : "$_id.date",
                "answers" : "$answers"
            })
            .build();

        const resultQuery = surveyResultCollection.aggregate<SurveyResultModel>(query);


        const surveyResult = await resultQuery.toArray();

        return surveyResult?.length ? surveyResult[0] : null
    }

}