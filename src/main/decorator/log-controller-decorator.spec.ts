import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { serverError } from "@/presentation/helpers/http/http-helper"
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"
import { LogControllerDecorator } from "./log-controller-decorator"
import {makeLogRepositoryStub} from "@/data/test";

type SutTypes ={
    sut: LogControllerDecorator
    stub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeHttpRequest = (): HttpRequest => ({
    body: {
        name: "any_name",
        email: "valid_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
    }
})

const makeStub = ():Controller => {
    class ControllerStub implements Controller{
        handle(httpRequest: any): Promise<HttpResponse> {
            const httpResponse: HttpResponse= {
                statusCode: 200,
                body:{
                    name: "Pedro"
                }
            }
            return new Promise(resolve=>resolve(httpResponse))
        }
    }

    return new ControllerStub()
}

const makeSut = (): SutTypes => {
    const stub = makeStub()
    const logErrorRepositoryStub = makeLogRepositoryStub()
    const sut = new LogControllerDecorator(stub, logErrorRepositoryStub)

    return {
        sut,
        stub,
        logErrorRepositoryStub
    }
}

describe("Log Decorator Tests", () => {
    test("Should call handle", async ()=>{
        
        const {sut, stub} = makeSut()
        const handleSpy = jest.spyOn(stub, "handle")
        
        await sut.handle(makeHttpRequest())

        expect(handleSpy).toHaveBeenCalledWith(makeHttpRequest())
        
    })
    
    test("Should return the same result of the controller", async ()=>{
        
        const {sut, stub} = makeSut()
        
        const response = await sut.handle(makeHttpRequest())

        expect(response).toEqual({
            statusCode:200,
            body:{
                name: "Pedro"
            }
        })
    })

    test("Should call LogErrorRepository with correct error if controller throws a server error", async ()=>{
        
        const {sut, stub, logErrorRepositoryStub} = makeSut()
        
        const fakeError = new Error()
        fakeError.stack="any_stack"

        const error = serverError(fakeError)

        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(stub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
        
        const handleSpy = jest.spyOn(stub, "handle")
        
        await sut.handle(makeHttpRequest())
        expect(logSpy).toHaveBeenCalledWith("any_stack")
        

    })
})