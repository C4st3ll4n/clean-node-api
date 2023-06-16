import { badRequest, ok, serverError, unauthorized } from "../../helpers/http/http-helper";
import { Validation } from "../../protocols/validation";
import { Authentication, Controller, HttpRequest, HttpResponse } from "./login-controller-protocols";

export class LoginController implements Controller {

    constructor(private readonly validation: Validation, private readonly authentication: Authentication) { }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {

            const error = this.validation.validate(httpRequest.body)

            if (error) return badRequest(error)

            const { password, email } = httpRequest.body

            const token = await this.authentication.auth({ email, password })

            if (!token) return unauthorized()

            return ok({
                accessToken: token
            })

        } catch (err) {
            return serverError(err)
        }
    }

}