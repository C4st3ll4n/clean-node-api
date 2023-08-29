import {MongoHelper} from "../helpers/mongo-helper";
import {Collection} from "mongodb";
import {SurveyResultMongoRepository} from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";
import {SurveyModel} from "@/domain/models/survey";
import {AccountModel} from "@/domain/models/account";
import {hash} from "bcrypt";
import {SurveyResultModel} from "@/domain/models/survey-result";

const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository();
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
        id: surveyResult._id,
        answer: surveyResult.answer,
        accountId: surveyResult.accountId,
        date: surveyResult.date,
        surveyId: surveyResult.surveyId
    }
}

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

describe("Survey Result Mongo Repository", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection("surveys");
        await surveyCollection.deleteMany({});
        surveyResultCollection = await MongoHelper.getCollection("surveyResults");
        await surveyCollection.deleteMany({});
        accountCollection = await MongoHelper.getCollection("accounts");
        await surveyCollection.deleteMany({});
    });

    describe("Save survey result", () => {

        test("Should create a survey result on new record", async () => {
            const survey = await makeSurvey();
            const account = await makeAccount();
            const sut = makeSut();

            const surveyResult = await sut.save({
                accountId: account.id,
                answer: survey.answers[0].answer,
                date: new Date(),
                surveyId: survey.id
            });

            expect(surveyResult).toBeTruthy();
            expect(surveyResult.id).toBeTruthy();
            expect(surveyResult.answer).toEqual(survey.answers[0].answer);
        });

        test("Should update a survey result", async () => {
            const survey = await makeSurvey();
            const account = await makeAccount();
            const createdSurveyResult = await makeSurveyResult(account.id,survey.id )

            const sut = makeSut();

            const updatedSurveyResult = await sut.save({
                accountId: account.id,
                answer: survey.answers[1].answer,
                date: new Date(),
                surveyId: survey.id
            });

            expect(updatedSurveyResult).toBeTruthy();
            expect(updatedSurveyResult.id).toEqual(createdSurveyResult.id);
            expect(updatedSurveyResult.answer).toEqual("any_other_answer");
        });
    })
});