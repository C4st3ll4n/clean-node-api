import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";
import { Request, Response } from "express";
export const adaptRoute = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httpReq: HttpRequest = {
            body: req.body
        }
        const httpRes: HttpResponse = await controller.handle(httpReq)
        if(httpRes.statusCode === 500){
            res.status(httpRes.statusCode).json({
                error: httpRes.body.message
            })
        } else{
            res.status(httpRes.statusCode).json(httpRes.body)
        }
        
    }
}