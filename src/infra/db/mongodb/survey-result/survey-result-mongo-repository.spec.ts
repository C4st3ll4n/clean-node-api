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
        answers: surveyResult.answers,
        accountId: surveyResult.accountId,
        date: surveyResult.date,
        surveyId: surveyResult.surveyId,
        question: surveyResult.question
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
            expect(surveyResult.answers).toBeTruthy();
            expect(surveyResult.surveyId).toEqual(survey.id);
            expect(surveyResult.answers[0].answer).toEqual(survey.answers[0].answer);
            expect(surveyResult.answers[0].count).toEqual(1);
            expect(surveyResult.answers[0].percent).toEqual(100);
        });

        test("Should update a survey result", async () => {
            const survey = await makeSurvey();
            const account = await makeAccount();
            const createdSurveyResult = await makeSurveyResult(account.id,survey.id )

            const sut = makeSut();

            await sut.save({
                accountId: account.id,
                answer: survey.answers[0].answer,
                date: new Date(),
                surveyId: survey.id
            });

            const updatedSurveyResult = await sut.save({
                accountId: account.id,
                answer: survey.answers[1].answer,
                date: new Date(),
                surveyId: survey.id
            });

            expect(updatedSurveyResult).toBeTruthy();
            expect(updatedSurveyResult.surveyId).toEqual(createdSurveyResult.surveyId);
            expect(updatedSurveyResult.answers[0].count).toEqual(1);
            expect(updatedSurveyResult.answers[0].percent).toEqual(100);
            expect(updatedSurveyResult.answers[1].count).toEqual(0);
            expect(updatedSurveyResult.answers[1].percent).toEqual(0);
        });
    })

    describe("Load Survey result", ()=>{
        test("Should load a survey result", async () => {
            const survey = await makeSurvey();
            const account = await makeAccount();
            const sut = makeSut();

            await sut.save({
                accountId: account.id,
                answer: survey.answers[0].answer,
                date: new Date(),
                surveyId: survey.id
            });

            const surveyResult = await sut.loadBySurveyId(survey.id);

            expect(surveyResult).toBeTruthy();
            expect(surveyResult.answers).toBeTruthy();
            expect(surveyResult.surveyId).toEqual(survey.id);
            expect(surveyResult.answers[0].answer).toEqual(survey.answers[0].answer);
            expect(surveyResult.answers[0].count).toEqual(1);
            expect(surveyResult.answers[0].percent).toEqual(100);
        });

    })
});
