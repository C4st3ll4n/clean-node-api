export const answerSchema = {
    title:"Survey Answer Model",
    type: 'object',
    description: "Resposta retornada pela API",
    properties:{
        image: {
            type: "string"
        },
        answer: {
            type: "string"
        }
    }
}