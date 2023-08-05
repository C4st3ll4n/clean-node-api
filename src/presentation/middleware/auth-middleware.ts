import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccessDeniedError } from "../errors";
import { forbidden, ok } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../protocols";
import { Middleware } from "../protocols/middleware";

export class AuthMiddleware implements Middleware{

    constructor(private readonly loadAccountToken: LoadAccountByToken){}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const token = httpRequest.headers?.["x-access-token"];
        if(token){
            const account = await this.loadAccountToken.load(token)
            if(account){
                return ok({accountId: account.id});
            }
        }
        
        return forbidden(new AccessDeniedError())
    }

}