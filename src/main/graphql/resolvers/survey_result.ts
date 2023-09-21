import {adaptResolver} from "@/main/adapter";
import { makeLoadSurveyResultController } from "@/main/factory/controller/survey-result/load-survey-result/load-survey-result-controller-factory";
import { makeSaveSurveyResultController } from "@/main/factory/controller/survey-result/save-survey-result/save-survey-result-controller-factory";

export default {
    Query: {
        surveyResult: async (_:any, args:any, context:any) => adaptResolver(makeLoadSurveyResultController(), args, context)
    },
    Mutation:{
        addAnswer: async (_:any, args:any, context:any) => adaptResolver(makeSaveSurveyResultController(), args, context)
    }
}