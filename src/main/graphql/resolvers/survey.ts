import {makeLoginController} from "@/main/factory/controller/account/login/login-controller-factory";
import {adaptResolver} from "@/main/adapter";
import {makeSignUpController} from "@/main/factory/controller/account/signup/signup-controller-factory";
import {makeListSurveyController} from "@/main/factory/controller/survey/list-survey/list-survey-controller-factory";
import {
    makeCreateSurveyController
} from "@/main/factory/controller/survey/create-survey/create-survey-controller-factory";

export default {
    Query: {
        surveys: async () => adaptResolver(makeListSurveyController(), {})
    },
    Mutation:{
        create: async (_:any, args:any) => adaptResolver(makeCreateSurveyController(), args)
    }
}