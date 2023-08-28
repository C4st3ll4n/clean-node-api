import {ListSurvey} from "@/domain/usecases/list-survey";
import {SurveyModel} from "@/domain/models/survey";
import {ListSurveyRepository} from "../../protocols/db/survey/list-survey-repository";
import {LoadSurveyById} from "@/domain/usecases/load-survey-by-id";

export class DBListSurvey implements ListSurvey, LoadSurveyById {

    constructor(private readonly repository: ListSurveyRepository) {
    }
    async getAll(): Promise<SurveyModel[]> {
        return await this.repository.all();
    }

    async load(accountId:string): Promise<SurveyModel[]> {
        return await this.repository.load(accountId);
    }

    async loadById(surveyID: string): Promise<SurveyModel> {
        return await this.repository.loadById(surveyID);
    }

}