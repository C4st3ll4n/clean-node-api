export const addSurveySchema = {
    title:"Survey Param",
    type: 'object',
    description: "Enquete a ser criado API",
    properties:{
        question: {
            type: "string"
        },
        answers: {
            type: "array",
            items: {
                $ref: "#/schemas/answer"
            }
        },
    }
}