import {makeLoginController} from "@/main/factory/controller/account/login/login-controller-factory";
import {adaptResolver} from "@/main/adapter";

export default {
    Query: {
        login: async (_: any, args: any) => adaptResolver(makeLoginController(), args)
    }
}