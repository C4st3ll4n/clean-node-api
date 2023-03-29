import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "./login-protocols";

export class LoginController implements Controller {

    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredFields = ['email', 'password']

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return new Promise(resolve => resolve(
                        badRequest(new MissingParamError(field))))
                }
            }

            const { password, email } = httpRequest.body

            const isValid = this.emailValidator.isValid(email)
            if (!isValid) return new Promise(resolve => resolve(
                badRequest(new InvalidParamError("email"))))


        } catch (err) {
            return new Promise(resolve => resolve(serverError(err)))
        }
    }

}