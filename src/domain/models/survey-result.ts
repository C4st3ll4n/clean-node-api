export type SurveyResultModel = {
    surveyId: string
    accountId: string
    question: string
    answers: SurveyAnswerModel[]
    date: Date
}

type SurveyAnswerModel = {
    image?: string,
    answer: string,
    count: number,
    percent: number
}