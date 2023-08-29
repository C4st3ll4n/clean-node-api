import {AddSurveyRepository} from "@/data/protocols/db/survey/add-survey-repository";
import {AddSurveyModel} from "@/domain/usecases/survey/add-survey";
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
    const surveys: any[] =  await surveyCollection.find().toArray();
    if(surveys.length==0) return [];
    return surveys.map((value):SurveyModel=>({
      question:value.question,
      id:value._id,
      date:value.date,
      answers:value.answers
    }))
  }

  load(accountId: string): Promise<SurveyModel[]> {
    return Promise.resolve([]);
  }

  async loadById(surveyId: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection("surveys")
    const survey = await surveyCollection.findOne({_id: surveyId})

    if(survey != null){
      return {
        id: survey._id,
        answers: survey.answers,
        date: survey.date,
        question: survey.question
      }
    }
    return null
  }
}
