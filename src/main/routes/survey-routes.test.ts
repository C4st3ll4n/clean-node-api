import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import env from "../config/env";

let surveyColletion;
let accountCollection;

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

    accountCollection = await MongoHelper.getCollection("account");
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
  });

  test("Should return 204 on surveys", async () => {
    const resCreate = await accountCollection.insertOne({
      name: "Fulano",
      email: "dulagno@gmail.com",
      password: hash("123", 12),
      role: 'admin'
    });

    const id = resCreate.ops[0]._id;
    const accessToken = sign({ id }, env.SECRET);

    const resUpdate = await accountCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          accessToken,
        },
      }
    );

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
