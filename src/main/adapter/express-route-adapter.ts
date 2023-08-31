import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";
import { Request, Response } from "express";
export const adaptRoute = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httpReq: HttpRequest = {
            body: req.body,
            params: req.params,
            accountId: req.accountId
        }
        const httpRes: HttpResponse = await controller.handle(httpReq)
        if (httpRes.statusCode >= 200 && httpRes.statusCode<=299){
            res.status(httpRes.statusCode).json(httpRes.body)
        }else{
            res.status(httpRes.statusCode).json({
                error: httpRes.body.message
            })
        }
    }
}