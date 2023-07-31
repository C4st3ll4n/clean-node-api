import { MongoHelper } from "../helpers/mongo-helper";
import { SurveyMongoRepository } from "./survey-mongo-repository";
import { Collection } from "mongodb";
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

  test("Should return a survey on add success", async () => {
    const sut = makeSut();
    await sut.add({
      question:"any_question",
      answers:[
        {image:"any_image", answer: "any_answer"},
        {image:"any_other_image", answer: "any_other_answer"}
      ]
    });

    const survey = await surveyCollection.findOne({ question: "any_question"})
    expect(survey).toBeTruthy();
    
    expect(survey.question).toBe("any_question");
    expect(survey.answers).toBeTruthy();

  });
});
