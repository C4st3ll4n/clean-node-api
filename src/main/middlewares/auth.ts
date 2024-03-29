import {adaptMiddleware} from "../adapter/express-middleware-adapter";
import {makeAuthMiddleware} from "../factory/middleware/auth-middleware-factory";

export const auth = adaptMiddleware(makeAuthMiddleware());
