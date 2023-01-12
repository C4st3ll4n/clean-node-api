import { BcryptAdapter } from "./bcrypt-adapter"
import bcrypt from 'bcrypt'
import { resolve } from "path"

jest.mock('bcrypt', ()=>({
    async hash(): Promise<String> {
        return new Promise(resolve => resolve("valid_hash"))
    }
}))

describe("Bcrypt Adapter", ()=>{
    test("Should call bcrypt with correct value", async ()=>{
        const salt = 12;
        const sut = new BcryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt("any_value")
        expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
    })

    test("Should return a hash on success", async ()=>{
        const salt = 12;
        const sut = new BcryptAdapter(salt)
        const hash = await sut.encrypt("any_value")
        expect(hash).toBe("valid_hash")
    })
})