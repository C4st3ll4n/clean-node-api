import {MongoHelper} from "../helpers/mongo-helper";
import {SurveyMongoRepository} from "./survey-mongo-repository";
import {Collection} from "mongodb";
import {SurveyModel} from "@/domain/models/survey";
import {AccountModel} from "@/domain/models/account";
import {hash} from "bcrypt";
import {SurveyResultModel} from "@/domain/models/survey-result";
import { faker } from '@faker-js/faker';

const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository();
};

const makeSurvey = async (): Promise<SurveyModel> => {
    const res = await surveyCollection.insertOne({
        question: faker.string.sample(50),
        answers: [
            {image: faker.image.url(), answer: faker.string.sample(30)},
            {image: faker.image.url(), answer: faker.string.sample(20)}
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

const makeAccount = async (): Promise<AccountModel> => {
    const res = await accountCollection.insertOne({
        name: "Fulano de Tal",
        email: "fulano@gmail.com",
        password: await hash("123", 12),
        role: "admin"
    });
    const account = res.ops[0];
    return {
        id: account._id,
        name: account.name,
        email: account.email,
        password: account.password,
    };
}
const makeSurveyResult = async (accountId: string, surveyId: string): Promise<SurveyResultModel> => {
    const res = await surveyResultCollection.insertOne({
        answer: "any_answer",
        date: new Date(),
        surveyId: surveyId,
        accountId: accountId
    });
    const surveyResult = res.ops[0];
    return {
        answers: surveyResult.answers,
        date: surveyResult.date,
        surveyId: surveyResult.surveyId,
        question: surveyResult.question
    }
}


let surveyCollection: Collection;
let accountCollection: Collection;
let surveyResultCollection: Collection;

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

        accountCollection = await MongoHelper.getCollection("accounts");
        await surveyCollection.deleteMany({});

        surveyResultCollection = await MongoHelper.getCollection("surveyResults");
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
                const result = await sut.loadById("528ad922df454bf6b51b007f");
                expect(result).toBeNull()

            })
        })

        describe("by account id", () => {
            test("Should return a survey with answer true", async () => {
                const sut = makeSut();
                const account = await makeAccount();

                const createdSurvey = await makeSurvey();
                await makeSurvey();

                const surveyResult = await makeSurveyResult(account.id,createdSurvey.id);

                const result = await sut.loadByAccountID(account.id);
                expect(result[0].id).toEqual(createdSurvey.id)
                expect(result[0].didAnswer).toEqual(true)
            })

            test("Should return a survey with answer false", async () => {
                const sut = makeSut();
                const createdSurvey = await makeSurvey();
                const createdAccount = await makeAccount();
                const result = await sut.loadByAccountID(createdAccount.id);
                expect(result[0].id).toEqual(createdSurvey.id)
                expect(result[0].didAnswer).toEqual(false)
            })
            test("Should return empty", async () => {
                const sut = makeSut();
                const result = await sut.loadByAccountID("528ad922df454bf6b51b007f");
                expect(result.length).toEqual(0)

            })
        })
    })
});
