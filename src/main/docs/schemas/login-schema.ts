export const loginSchema = {
    title:"Login model",
    type: 'object',
    required: ["email", "password"],
    properties:{
        email: {
            type: 'string'
        },
        password:{
            type:'string'
        }
    }
}