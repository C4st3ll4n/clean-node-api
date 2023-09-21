import typeDefs from "@/main/graphql/type_defs";
import { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import resolvers from "@/main/graphql/resolvers";
import schemasDirectives from "../graphql/directives";
// @ts-ignore
const handleErrors = (response: any, errors: readonly GraphQLError[]) => {
  errors?.forEach((error) => {
    response.data = undefined;
    if (checkError(error, "AuthenticationError")) {
      response.http.status = 401;
    } else if (checkError(error, "ForbiddenError")) {
      response.http.status = 403;
    } else if (checkError(error, "UserInputError")) {
      response.http.status = 400;
    } else {
      response.http.status = 500;
    }
  });
};

// @ts-ignore
const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(
    (name) => name === errorName
  );
};
export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({ req }) => ({ req }),
    plugins: [
      {
        requestDidStart: async () => ({
          willSendResponse: ({ response, errors }): any =>
            handleErrors(response, errors),
        }),
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
};
