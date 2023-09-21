import {HttpResponse} from "@/presentation/protocols";
import {makeAuthMiddleware} from "@/main/factory/middleware/auth-middleware-factory";
import {ForbiddenError} from "apollo-server-express";

export class AuthDirective {
    // @ts-ignore
    visitFieldDefinition(field: GraphQLField<any, any>): any {
        // @ts-ignore
        const {resolve = defaultFieldResolver} = field
        field.resolve = async (parent, args, context, info) => {
            const request = {
                token : context.request.headers?.['x-access-token'],
                ...(context.request.headers||{}),
            };

            const httpResponse: HttpResponse = await makeAuthMiddleware().handle(request);

            if (httpResponse.statusCode >= 200 && httpResponse.statusCode<=299) {
                Object.assign(request, httpResponse.body)
                return resolve.call(this, parent, args, context, info);
            } else {
                throw new ForbiddenError(httpResponse.body.message??httpResponse.body.reason)
            }
        }
    }
}