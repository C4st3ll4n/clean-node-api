import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "./login-protocols";

export class LoginController implements Controller {

    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication

    constructor(emailValidator: EmailValidator, auth: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = auth
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

            const token = this.authentication.auth(email, password)

        } catch (err) {
            return new Promise(resolve => resolve(serverError(err)))
        }
    }

}