import {ListSurvey} from "../../../domain/usecases/list-survey";
import {SurveyModel} from "../../../domain/models/survey";
import {ListSurveyRepository} from "../../protocols/db/survey/list-survey-repository";

export class DBListSurvey implements ListSurvey {

    constructor(private readonly repository: ListSurveyRepository) {
    }
    async getAll(): Promise<SurveyModel[]> {
        return await this.repository.all();
    }

    async load(accountId:string): Promise<SurveyModel[]> {
        return await this.repository.load(accountId);
    }

}