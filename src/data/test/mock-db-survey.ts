import {AddSurveyRepository} from "@/data/protocols/db/survey/add-survey-repository";
import {ListSurveyRepository} from "@/data/protocols/db/survey/list-survey-repository";
import {SurveyModel} from "@/domain/models/survey";
import {makeFakeSurvey} from "@/domain/test";

export const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
        async add(): Promise<void> {
            return null;
        }
    }

    return new AddSurveyRepositoryStub();
};

export const makeListSurveyRepositoryStub = (): ListSurveyRepository => {
    class ListSurveyRepositoryStub implements ListSurveyRepository {
        async all(): Promise<SurveyModel[]> {
            return Promise.resolve([
                makeFakeSurvey()
            ]);
        }

        load(accountId: string): Promise<SurveyModel[]> {
            return Promise.resolve([
                makeFakeSurvey()
            ]);
        }

        loadById(surveyId: string): Promise<SurveyModel> {
            return Promise.resolve(makeFakeSurvey());
        }
    }

    return new ListSurveyRepositoryStub();
};