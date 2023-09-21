import {makeLoginController} from "@/main/factory/controller/account/login/login-controller-factory";
import {adaptResolver} from "@/main/adapter";
import {makeSignUpController} from "@/main/factory/controller/account/signup/signup-controller-factory";

export default {
    Query: {
        login: async (_: any, args: any) => adaptResolver(makeLoginController(), args)
    },
    Mutation:{
        signUp: async (_:any, args:any) => adaptResolver(makeSignUpController(), args)
    }
}