export const surveyResultSchema = {
    title:"Survey Result Model",
    type: 'object',
    description: "Resposta retornada pela API",
    properties:{
        id: {
            type: "string"
        },
        surveyId: {
            type: "string"
        },
        accountId: {
            type: "string"
        },
        date: {
            type: "string",
            format: "date"
        },
        answer: {
            type: "string",
        },
    }
}