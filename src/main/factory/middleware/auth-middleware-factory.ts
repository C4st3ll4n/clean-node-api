import { AuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { Middleware } from "@/presentation/protocols/middleware";
import { makeDbLoadAccount } from "../usecase/account/db-load-account-factory";

export const makeAuthMiddleware = (role?:string): Middleware => {
    return new AuthMiddleware(makeDbLoadAccount(), role);
}