import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import env from "../config/env";
import { Collection } from "mongodb";
import { SurveyModel } from "@/domain/models/survey";
const ObjectId = require("mongodb").ObjectId;

let surveyCollection: Collection;
let accountCollection: Collection;

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: "any_question",
    answers: [
      { image: "any_image", answer: "any_answer" },
      { image: "any_other_image", answer: "any_other_answer" },
    ],
    date: new Date(),
  });
  const survey = await surveyCollection.findOne({ _id: res.insertedId });
  return {
    id: survey._id.toHexString(),
    answers: survey.answers,
    date: survey.date,
    question: survey.question,
  };
};

const makeAccessToken = async (): Promise<string> => {
  const resCreate = await accountCollection.insertOne({
    name: "Fulano de Tal",
    email: "fulano@gmail.com",
    password: await hash("123", 12),
  });

  const id = resCreate.insertedId;
  const token = sign({ id }, env.SECRET);
  await accountCollection.updateOne(
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
};

describe("Survey Result Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});

    accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("PUT /surveys/:surveyId/results", () => {
    test("Should return 403 on save survey result without accessToken", async () => {
      await request(app)
        .put("/api/surveys/any_id/results")
        .send({
          answer: "any_answer",
        })
        .expect(403);
    });

    test("Should return 200 on save survey result success", async () => {
      const accessToken = await makeAccessToken();
      const survey = await makeSurvey();
      await request(app)
        .put(`/api/surveys/${survey.id}/results`)
        .set("x-access-token", accessToken)
        .send({
          answer: "any_answer",
        })
        .expect(200);
    });
  });
  describe("GET /surveys/:surveyId/results", () => {
    test("Should return 403 on load survey result without accessToken", async () => {
      await request(app)
        .get("/api/surveys/any_survey_id/results")
        .send({
          answer: "any_answer",
        })
        .expect(403);
    });

    test("Should return 404 on load survey null return", async () => {
      const accessToken = await makeAccessToken();

      await request(app)
        .get("/api/surveys/A6BF50DFA6277B2E471F6193/results")
        .set("x-access-token", accessToken)
        .expect(404);
    });

    test("Should return 200 on load survey result success", async () => {
      const accessToken = await makeAccessToken();
      const survey = await makeSurvey();
      await request(app)
        .get(`/api/surveys/${survey.id}/results`)
        .set("x-access-token", accessToken)
        .expect(200);
    });
  });
});
