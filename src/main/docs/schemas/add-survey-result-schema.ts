export const addSurveyResultSchema = {
    title:"Survey Result Param",
    type: 'object',
    description: "Resposta a ser criada pela API",
    properties:{
        answer: {
            type: "string"
        }
    }
}