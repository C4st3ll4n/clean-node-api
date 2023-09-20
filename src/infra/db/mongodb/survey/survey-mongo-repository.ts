import {AddSurveyRepository} from "@/data/protocols/db/survey/add-survey-repository";
import {MongoHelper} from "../helpers/mongo-helper";
import {ListSurveyRepository} from "@/data/protocols/db/survey/list-survey-repository";
import {QueryBuilder} from "@/infra/db/mongodb/helpers";

const ObjectId = require("mongodb").ObjectId;

export class SurveyMongoRepository implements AddSurveyRepository, ListSurveyRepository {
    async add(data: AddSurveyRepository.Param): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection("surveys");
        await surveyCollection.insertOne(data);
    }

    async all(): Promise<ListSurveyRepository.Results> {
        const surveyCollection = await MongoHelper.getCollection("surveys");
        const surveys: any[] = await surveyCollection.find().toArray();
        if (surveys.length == 0) return [];
        return surveys.map((value):ListSurveyRepository.Result => ({
            question: value.question,
            id: value._id,
            date: value.date,
            answers: value.answers
        }))
    }

    async loadByAccountID(accountId: string): Promise<ListSurveyRepository.Results> {
        const surveyCollection = await MongoHelper.getCollection("surveys");

        const query = new QueryBuilder()
            .lookup({
                from: "surveyResults",
                foreignField: "surveyId",
                localField: "_id",
                as: "result"
            })
            .project({
                _id: 1,
                question: 1,
                answers: 1,
                date: 1,
                didAnswer: {
                    $gte: [{
                        $size: {
                            $filter: {
                                input: "$result",
                                as: "it",
                                cond: {
                                    $eq: ["$$it.accountId", accountId],
                                }
                            }
                        },
                    }, 1
                    ],
                }
            }).build()

        const surveys = await surveyCollection.aggregate(query).toArray()
        if (!surveys) return []

        return surveys.map((value): ListSurveyRepository.Result => ({
            question: value.question,
            id: value._id,
            date: value.date,
            answers: value.answers,
            didAnswer: value.didAnswer
        }));
    }

    async loadById(surveyId: string): Promise<ListSurveyRepository.Result> {
        const surveyCollection = await MongoHelper.getCollection("surveys")

        const survey = await surveyCollection.findOne({_id: new ObjectId(surveyId)})

        if (survey != null) {
            return {
                id: survey._id,
                answers: survey.answers,
                date: survey.date,
                question: survey.question
            }
        }
        return null
    }
}
