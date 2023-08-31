import {MongoHelper} from "../helpers/mongo-helper";
import {SurveyMongoRepository} from "./survey-mongo-repository";
import {Collection} from "mongodb";
import {SurveyModel} from "@/domain/models/survey";

const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository();
};

const makeSurvey = async (): Promise<SurveyModel> => {
    const res = await surveyCollection.insertOne({
        question: "any_question",
        answers: [
            {image: "any_image", answer: "any_answer"},
            {image: "any_other_image", answer: "any_other_answer"}
        ],
        date: new Date()
    })
    const survey = res.ops[0];
    return  {
        id: survey._id,
        answers: survey.answers,
        date: survey.date,
        question: survey.question
    }
}

let surveyCollection: Collection;

describe("Survey Mongo Repository", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection("surveys");
        await surveyCollection.deleteMany({});
    });

    describe("AddSurvey", () => {

        test("Should return a survey on add success", async () => {
            const sut = makeSut();
            await sut.add({
                question: "any_question",
                answers: [
                    {image: "any_image", answer: "any_answer"},
                    {image: "any_other_image", answer: "any_other_answer"}
                ],
                date: new Date()
            });

            const survey = await surveyCollection.findOne({question: "any_question"})
            expect(survey).toBeTruthy();

            expect(survey.question).toBe("any_question");
            expect(survey.answers).toBeTruthy();

        });
    })

    describe("ListSurvey", () => {
        describe("all", () => {
            test("Should return a list of surveys", async () => {

                const sut = makeSut();

                await sut.add({
                    question: "any_question",
                    answers: [
                        {image: "any_image", answer: "any_answer"},
                        {image: "any_other_image", answer: "any_other_answer"}
                    ],
                    date: new Date()
                });

                await sut.add({
                    question: "other_question",
                    answers: [
                        {image: "other_image", answer: "other_answer"},
                    ],
                    date: new Date()
                });


                const result = await sut.all();
                expect(result.length).toBe(2)
                expect(result[0].id).toBeTruthy()
            })

            test("Should return a empty list of surveys", async () => {
                const sut = makeSut();
                const result = await sut.all();
                expect(result.length).toBe(0)

            })
        })

        describe("by survey id", () => {
            test("Should return a survey", async () => {
                const sut = makeSut();
                const createdSurvey = await makeSurvey();
                const result = await sut.loadById(createdSurvey.id);
                expect(result.id).toEqual(createdSurvey.id)
            })

            test("Should return null", async () => {
                const sut = makeSut();
                const result = await sut.loadById("any_id");
                expect(result).toBeNull()

            })
        })
    })
});
