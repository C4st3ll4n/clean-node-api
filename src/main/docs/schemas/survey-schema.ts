export const surveySchema = {
    title:"Survey Model",
    type: 'object',
    description: "Enquete retornado pela API",
    properties:{
        question: {
            type: "string"
        },
        id: {
            type: "string"
        },
        date: {
            type: "string",
            format: "date"
        },
        answers: {
            type: "array",
            items: {
                $ref: "#/schemas/answer"
            }
        },
    }
}