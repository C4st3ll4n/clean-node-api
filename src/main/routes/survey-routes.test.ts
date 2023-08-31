import request from "supertest";
import app from "../config/app";
import {MongoHelper} from "@/infra/db/mongodb/helpers/mongo-helper";
import {hash} from "bcrypt";
import {sign} from "jsonwebtoken";
import env from "../config/env";
import { Collection } from "mongodb";
const ObjectId = require("mongodb").ObjectId;

let surveyColletion: Collection;
let accountCollection: Collection;


const makeAccessToken = async (): Promise<string> => {

    const resCreate = await accountCollection.insertOne({
        name: "Fulano de Tal",
        email: "fulano@gmail.com",
        password: await hash("123", 12),
        role: "admin"
    });

    const id = resCreate.ops[0]._id;
    const token = sign({id}, env.SECRET);
    const updateResult = await accountCollection.updateOne(
        {
            _id: new ObjectId(id),
        },
        {
            $set: {
                accessToken: token,
            },
        }
    );

    return token;
}

describe("Survey Routes", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);

    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        surveyColletion = await MongoHelper.getCollection("surveys");
        await surveyColletion.deleteMany({});

        accountCollection = await MongoHelper.getCollection("accounts");
        await accountCollection.deleteMany({});
    });

    describe("POST /surveys", () => {
        test("Should return 403 on surveys without accessToken", async () => {
            await request(app)
                .post("/api/surveys")
                .send({
                    question: "any_question",
                    answers: [
                        {
                            image: "any_image",
                            answer: "any_answer",
                        },
                    ],
                })
                .expect(403);
        });

        test("Should return 204 on surveys", async () => {
            const accessToken = await makeAccessToken();

            await request(app)
                .post("/api/surveys")
                .set("x-access-token", accessToken)
                .send({
                    question: "any_question",
                    answers: [
                        {
                            image: "any_image",
                            answer: "any_answer",
                        },
                    ],
                })
                .expect(204);
        });

    });

    describe("GET /surveys", () => {
        test("Should return 403 on LoadSurveys without accessToken", async () => {
            await request(app)
                .get("/api/surveys")
                .expect(403);
        });

        test("Should return 404 on LoadSurveys successfully", async () => {
            const accessToken = await makeAccessToken();
            await request(app)
                .get("/api/surveys")
                .set("x-access-token", accessToken)
                .expect({})
                .expect(404);
        });
    })
});
