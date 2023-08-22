import {MongoHelper} from "../helpers/mongo-helper";
import {SurveyMongoRepository} from "./survey-mongo-repository";
import {Collection} from "mongodb";

const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository();
};

let surveyCollection: Collection;

describe("Account Mongo Repository", () => {
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

    describe("ListSurvey", ()=>{
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

        })

        test("Should return a empty list of surveys", async () => {

            const sut = makeSut();
            const result = await sut.all();
            expect(result.length).toBe(0)

        })
    })
});
