export const errorAPISchema = {
    title:"Error model",
    type: 'object',
    required: ["statusCode", "body"],
    properties:{
        statusCode: {
            type: 'integer'
        },
        body:{
            type:'object'
        }
    }
}