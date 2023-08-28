import { NextFunction, Request, Response } from "express";
import { Middleware } from "@/presentation/protocols/middleware";
import { HttpRequest, HttpResponse } from "@/presentation/protocols";

export const adaptMiddleware = (middlewares: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.header,
    };

    const httpResponse: HttpResponse = await middlewares.handle(httpRequest);

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode<=299) {
        Object.assign(req, httpResponse.body)
      next();
    } else {
      res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.body.message });
    }
  };
};
