import { AddSurvey, AddSurveyParam } from "@/domain/usecases/survey/add-survey";
import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";

export class DbAddSurvey implements AddSurvey{

    constructor(private readonly addSurveyRepository:AddSurveyRepository){}

    async add(data: AddSurveyParam): Promise<void> {
        return await this.addSurveyRepository.add(data)
    }

}