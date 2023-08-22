import {
  LoadAccountByToken,
  AccessDeniedError,
  forbidden,
  ok,
  serverError,
  HttpRequest,
  HttpResponse,
  Middleware,
} from "./auth-middleware-protocols";

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const token = httpRequest.headers?.["x-access-token"];
    try {
      if (token) {
        const account = await this.loadAccountToken.loadByToken(token, this.role);
        if (account) {
          return ok({ accountId: account.id });
        }
      }
    } catch (error) {
      return serverError(error);
    }

    return forbidden(new AccessDeniedError());
  }
}
