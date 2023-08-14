import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccessDeniedError } from "../errors";
import { forbidden, ok, serverError } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../protocols";
import { Middleware } from "../protocols/middleware";

export class AuthMiddleware implements Middleware{

    constructor(private readonly loadAccountToken: LoadAccountByToken, private readonly role?:string){}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const token = httpRequest.headers?.["x-access-token"];
        try {
            if(token){
                const account = await this.loadAccountToken.load(token, this.role)
                if(account){
                    return ok({accountId: account.id});
                }
            }
                
        } catch (error) {
            return serverError(error)    
        }
        
        return forbidden(new AccessDeniedError())
    }

}