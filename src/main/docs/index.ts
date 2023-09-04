import {loginPath} from "./paths/login-path"
import { badRequestResponse } from "./responses/bad-request-response";
import { forbiddenResponse } from "./responses/forbidden-response";
import { noContentResponse } from "./responses/no-content-response";
import { notFoundResponse } from "./responses/not-found-response";
import { serverErrorResponse } from "./responses/server-error-response";
import { unauthorizedResponse } from "./responses/unathourized-response";
import { accountSchema } from "./schemas/account-schema";
import { errorAPISchema } from "./schemas/error-api-schema";
import { loginSchema } from "./schemas/login-schema";
import {answerSchema} from "@/main/docs/schemas/answer-schema";
import {surveySchema} from "@/main/docs/schemas/survey-schema";
import {surveysSchema} from "@/main/docs/schemas/surveys-schema";
import {suveysPath} from "@/main/docs/paths/surveys-path";
import {apiKeySchema} from "@/main/docs/schemas/api-key-schema";
import {signupPath} from "@/main/docs/paths/signup-path";
import {signupSchema} from "@/main/docs/schemas/signup-schema";
import {addSurveySchema} from "@/main/docs/schemas/add-survey-schema";
import {addSurveyResultSchema} from "@/main/docs/schemas/add-survey-result-schema";
import {surveyResultSchema} from "@/main/docs/schemas/survey-result-schema";
import {surveyResultPath} from "@/main/docs/paths/survey-result-path";

export default {
  openapi: "3.0.0",
  security: [
    {
      apiKeyAuth: []
    }
  ],
  info: {
    title: "Survey API",
    description: "Clean Node Survey API: Create and manage surveys for developers",
    version: "0.0.3",
  },
  license:{
    name: "GPL3.0-or-later",
    url: "opensource.prg/licenses/GPL-3.0"
  },
  servers: [
    {
      url: "localhost:5050/api",
    },
  ],
  tags: [{
    name:"login",
  }, {
    name: "surveys"
  }],
  paths: {
    "/login":loginPath,
    "/surveys": suveysPath,
    "/signup": signupPath,
    "/surveys/{id}/results": surveyResultPath
  },
  schemas:{
    account: accountSchema,
    login: loginSchema,
    errorAPI: errorAPISchema,
    answer: answerSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    signup: signupSchema,
    addSurvey: addSurveySchema,
    addSurveyResult: addSurveyResultSchema,
    surveyResult: surveyResultSchema
  },
  responses:{
    noContent: noContentResponse,
    badRequest: badRequestResponse,
    unauthorized: unauthorizedResponse,
    forbidden: forbiddenResponse,
    notFound: notFoundResponse,
    serverError: serverErrorResponse
  },
  components: {
    securitySchema: {
      apiKeySchema
    }
  }
};
