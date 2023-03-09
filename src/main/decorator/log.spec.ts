import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

interface SutTypes {
    sut: LogControllerDecorator
    stub: Controller
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
    const sut = new LogControllerDecorator(stub)

    return {
        sut,
        stub
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
})