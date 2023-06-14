import jwt from "jsonwebtoken";
import { JWTAdapter } from "./jwt-adapter";
import { rejects } from "assert";


const makeSut = ():JWTAdapter => {
    const secret = 'secret';
    const sut = new JWTAdapter(secret)
    return sut;
}

describe("JWT adapter", ()=> {

    test('Should call sign with correct values', async ()=>{
        const sut = makeSut();
        const signSpy = jest.spyOn(jwt, 'sign');
        await sut.encrypt("any_id")
        expect(signSpy).toHaveBeenCalledWith({id:"any_id"},'secret')
    })
   
    test('Should throw when jwt throws', async ()=>{
        const sut = makeSut();
        jest.spyOn(sut, 'encrypt').mockImplementationOnce(()=>{
            return new Promise(()=>new Error());
        });
        const promise =  sut.encrypt("any_value");
        expect(promise).rejects.toThrow()
    })
})