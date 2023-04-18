import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, ok, serverError, unauthorized } from "../../helpers/http-helper";
import { Validation } from "../../helpers/validators/validation";
import { EmailValidator, Authentication, Controller, HttpRequest, HttpResponse } from "./login-protocols";

export class LoginController implements Controller {

    private readonly validation: Validation
    private readonly authentication: Authentication

    constructor(validation: Validation, auth: Authentication) {
        this.validation = validation
        this.authentication = auth
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {

            const error = this.validation.validate(httpRequest.body)

            if (error) return badRequest(error)

            const { password, email } = httpRequest.body

            const token = await this.authentication.auth(email, password)

            if (!token) return unauthorized()

            return ok({
                accessToken: token
            })

        } catch (err) {
            return serverError(err)
        }
    }

}