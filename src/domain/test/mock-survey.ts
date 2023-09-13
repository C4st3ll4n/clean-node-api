import {SurveyModel} from "@/domain/models/survey";

export const makeFakeSurvey = ():SurveyModel => {
    return {
        id: "any_survey_id",
        date: new Date(),
        question:"any_question",
        answers:[
            {
                image:"any_image",
                answer:"any_answer"
            }
        ]
    };
};