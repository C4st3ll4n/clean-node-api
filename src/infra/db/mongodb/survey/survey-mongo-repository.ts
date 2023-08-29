import {AddSurveyRepository} from "@/data/protocols/db/survey/add-survey-repository";
import {AddSurveyModel} from "@/domain/usecases/add-survey";
import {MongoHelper} from "../helpers/mongo-helper";
import {ListSurveyRepository} from "@/data/protocols/db/survey/list-survey-repository";
import {SurveyModel} from "@/domain/models/survey";

export class SurveyMongoRepository implements AddSurveyRepository, ListSurveyRepository {
  async add(data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(data);
  }

  async all(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    return await surveyCollection.find().toArray();
  }

  load(accountId: string): Promise<SurveyModel[]> {
    return Promise.resolve([]);
  }

  async loadById(surveyId: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection("surveys")
    return await surveyCollection.findOne({_id: surveyId})
  }
}
