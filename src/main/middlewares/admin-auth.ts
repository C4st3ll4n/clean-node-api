import {adaptMiddleware} from "../adapter/express-middleware-adapter";
import {makeAuthMiddleware} from "../factory/middleware/auth-middleware-factory";

export const adminAuth = adaptMiddleware(makeAuthMiddleware("admin"));
