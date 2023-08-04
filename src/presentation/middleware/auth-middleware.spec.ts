import {HttpRequest} from "../protocols"
import {forbidden} from "../helpers/http/http-helper"
import { AccessDeniedError } from "../errors"
import {AuthMiddleware} from "./auth-middleware"

interface SUTTypes{
    sut: AuthMiddleware
}

const makeSUT = ():SUTTypes => {
    const sut = new AuthMiddleware();
    return {sut}
}


describe("Auth Middleware", ()=>{
    test("Should return 403 when no x-access-token is provided on headers", async ()=>{
        const {sut} = makeSUT()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })
})