import { EmailInUseError } from "../../../errors"
import { badRequest, created, forbidden, ok, serverError } from "../../../helpers/http/http-helper"
import { AddAccount, HttpRequest, HttpResponse, Controller, Validation, Authentication } from "./signup-controller-protocols"

export class SignUpController implements Controller {

  constructor(private readonly addAccount: AddAccount, private readonly validation: Validation, private readonly authentication: Authentication) {
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {

      const error = this.validation.validate(httpRequest.body)
      
      if(error) return badRequest(error)
      
      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name, email, password
      })

      if(!account){
        return forbidden(new EmailInUseError);
      }
      const accessToken = await this.authentication.auth({
        email: email, password: password
      })
      return ok({accessToken: accessToken})

    } catch (error) {
      return serverError(error)
    }
  }

}