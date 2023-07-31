
import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { hash } from "bcrypt";

let surveyColletion;

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
  });

  describe("POST /surveys", () => {
    test("Should return 204 on surveys", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question:"any_question",
          answers:[{
            image:"any_image",
            answer: "any_answer"
          }]
        })
        .expect(204);
    });
  });
});
