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

export default {
  openapi: "3.0.0",
  info: {
    title: "Survey API",
    description: "Clean Node Survey API: Create and manage surveys for developers",
    version: "0.0.3",
  },
  servers: [
    {
      url: "localhost:5050/api",
    },
  ],
  tags: [{
    name:"login"
  }],
  paths: {
    "/login":loginPath
  },
  schemas:{
    account: accountSchema,
    login: loginSchema,
    errorAPI: errorAPISchema
  },
  responses:{
    noContent: noContentResponse,
    badRequest: badRequestResponse,
    unauthorized: unauthorizedResponse,
    forbidden: forbiddenResponse,
    notFound: notFoundResponse,
    serverError: serverErrorResponse
  }
};
