export const signupSchema = {
    title:"Signup model",
    type: 'object',
    required: ["email", "password", "name", "passwordConfirmation"],
    properties:{
        email: {
            type: 'string'
        },
        password:{
            type:'string'
        },
        name:{
            type:'string'
        },
        passwordConfirmation:{
            type:'string'
        }
    }
}