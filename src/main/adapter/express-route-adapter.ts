import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { Request, Response } from "express";
export const adaptRoute = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httpReq: HttpRequest = {
            body: req.body
        }
        const httpRes: HttpResponse = await controller.handle(httpReq)

        res.status(httpRes.statusCode).json(httpRes.body)
    }
}