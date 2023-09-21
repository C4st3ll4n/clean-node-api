import express  from "express";
import setupMiddlewares from "./middlewares";
import setupRoutes from "./routes";
import setupSwagger from "./config-swagger";
import setupApolloServer from "./graphql";

const app = express()

setupApolloServer(app).then(r => {})
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)

export default app;