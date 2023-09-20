import {SurveyModel} from "@/domain/models/survey";
import {Answer} from "@/domain/models/answer";

export interface AddSurvey {
    add(data: AddSurvey.Param): Promise<void>
}

export namespace AddSurvey {
    export type Param = {
        question: string;
        answers: Answer[];
        date: Date
        didAnswer?: true
    }
}