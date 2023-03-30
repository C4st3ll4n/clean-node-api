import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, ok, serverError, unauthorized } from "../../helpers/http-helper";
import { EmailValidator, Authentication, Controller, HttpRequest, HttpResponse } from "./login-protocols";

export class LoginController implements Controller {

    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication

    constructor(emailValidator: EmailValidator, auth: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = auth
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredFields = ['email', 'password']

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const { password, email } = httpRequest.body

            const isValid = this.emailValidator.isValid(email)
            if (!isValid) return badRequest(new InvalidParamError("email"))

            const token = await this.authentication.auth(email, password)
            if(!token) return unauthorized()

            return ok({
                accessToken: token
            })

        } catch (err) {
            return serverError(err)
        }
    }

}