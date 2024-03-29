import {SurveyResultModel} from "@/domain/models/survey-result";

export const makeFakeSurveyResult = (): SurveyResultModel => ({
    surveyId: "any_survey_id",
    date: new Date(),
    answers: [{
        answer: "any_answer",
        count: 1,
        image: "any_image",
        percent: 50,
        isCurrentAnswer: true
    },
        {
            answer: "other_answer",
            count: 1,
            image: "other_image",
            percent: 50,
            isCurrentAnswer: false
        }],
    question: "any_question"
});