import { badRequest, ok, serverError, unauthorized } from "../../../helpers/http/http-helper";
import { Validation } from "../../../protocols";
import { Authentication, Controller, HttpRequest, HttpResponse } from "./login-controller-protocols";

export class LoginController implements Controller {

    constructor(private readonly validation: Validation, private readonly authentication: Authentication) { }

    async handle(httpRequest: LoginController.Request): Promise<HttpResponse> {
        try {

            const error = this.validation.validate(httpRequest)

            if (error) return badRequest(error)

            const { password, email } = httpRequest

            const token = await this.authentication.auth({ email, password })

            if (!token) return unauthorized()

            return ok(token)

        } catch (err) {
            console.log(err)
            return serverError(err)
        }
    }
}

export namespace LoginController {
    export type Request = {
        password:string
        email: string
    }
}