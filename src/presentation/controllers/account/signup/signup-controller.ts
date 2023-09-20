import {EmailInUseError} from "../../../errors"
import {badRequest, forbidden, ok, serverError} from "../../../helpers/http/http-helper"
import {AddAccount, Authentication, Controller, HttpResponse, Validation} from "./signup-controller-protocols"

export class SignUpController implements Controller {

    constructor(private readonly addAccount: AddAccount, private readonly validation: Validation, private readonly authentication: Authentication) {
    }

    async handle(httpRequest: SignUpController.Request): Promise<HttpResponse> {
        try {

            const error = this.validation.validate(httpRequest)

            if (error) return badRequest(error)

            const {name, email, password} = httpRequest

            const account = await this.addAccount.add({
                name, email, password
            })

            if (!account) {
                return forbidden(new EmailInUseError);
            }
            const accessToken = await this.authentication.auth({
                email: email, password: password
            })
            return ok(accessToken)

        } catch (error) {
            return serverError(error)
        }
    }

}

export namespace SignUpController {
    export type Request = {
        email: string
        password: string,
        passwordConfirmation: string
        name: string
    }
}