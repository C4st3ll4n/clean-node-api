export const accountSchema = {
    title:"Account model",
    type: 'object',
    description: "Objeto retornado pela API",
    required:["accessToken"],
    properties:{
        accessToken: {
            type: 'string'
        }
    }
}