import {
    LoadAccountByToken,
    AccessDeniedError,
    forbidden,
    ok,
    serverError,
    HttpResponse,
    Middleware,
} from "./auth-middleware-protocols";

export class AuthMiddleware implements Middleware {
    constructor(
        private readonly loadAccountToken: LoadAccountByToken,
        private readonly role?: string
    ) {
    }

    async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
        try {
            const {token} = request
            if (token) {
                const account = await this.loadAccountToken.loadByToken(token, this.role);
                if (account) {
                    return ok({accountId: account.id});
                }
            }
            return forbidden(new AccessDeniedError());
        } catch (error) {
            return serverError(error);
        }
    }
}

export namespace AuthMiddleware {
    export type Request = {
        token?: string
    }
}