import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";

export class LogControllerDecorator implements Controller {

    constructor(private readonly controller: Controller, private readonly repository: LogErrorRepository) {
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const response = await this.controller.handle(httpRequest)

        if (response.statusCode === 500) {
            console.log(response.body.stack)
            await this.repository.logError(response.body.stack)
        }

        return response
    }
}