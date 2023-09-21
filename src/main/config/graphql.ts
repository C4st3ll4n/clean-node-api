import typeDefs from "@/main/graphql/type_defs"
import { Express } from "express"
import {ApolloServer, toApolloError} from "apollo-server-express";
import resolvers from "@/main/graphql/resolvers";

export default async (app: Express): Promise<void> => {

    const server = new ApolloServer({
        resolvers,
        typeDefs
    });

    await server.start();
    server.applyMiddleware({app});
}