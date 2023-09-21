import {Controller} from "@/presentation/protocols";
import {ApolloError, AuthenticationError, ForbiddenError, UserInputError} from "apollo-server-express";

export const adaptResolver = async (controller: Controller, args: any): Promise<any> => {
    const httpResponse = await controller.handle(args);
    switch (httpResponse.statusCode) {
        case 200:
        case 204:
            return httpResponse.body;
        case 400:
            throw new UserInputError(httpResponse.body.reason);
        case 401:
            throw new AuthenticationError(httpResponse.body.reason);
        case 403:
            throw new ForbiddenError(httpResponse.body.reason);
        default:
            throw new ApolloError(httpResponse.body.reason);
    }
}