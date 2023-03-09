import { LogErrorRepository } from "../../data/protocols/log-error-repository"
import { serverError } from "../../presentation/helpers/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

interface SutTypes {
    sut: LogControllerDecorator
    stub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeLogRepositoryStub = ():LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async log(stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new LogErrorRepositoryStub()
}

const makeStub = ():Controller => {
    class ControllerStub implements Controller{
        handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
        const httpRequest = {
            body: {
                email: "any_mail@mail.com",
                name:"any_name",
                password:"any_password",
                passwordConfirmation:"any_password"
            }
        }
        
        await sut.handle(httpRequest)

        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
        
    })
    
    test("Should return the same result of the controller", async ()=>{
        
        const {sut, stub} = makeSut()

        const httpRequest = {
            body: {
                email: "any_mail@mail.com",
                name:"any_name",
                password:"any_password",
                passwordConfirmation:"any_password"
            }
        }
        
        const response = await sut.handle(httpRequest)

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

        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        jest.spyOn(stub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
        
        const handleSpy = jest.spyOn(stub, "handle")

        const httpRequest = {
            body: {
                email: "any_mail@mail.com",
                name:"any_name",
                password:"any_password",
                passwordConfirmation:"any_password"
            }
        }
        
        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith("any_stack")
        

    })
})