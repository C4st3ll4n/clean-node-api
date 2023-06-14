import { BcryptAdapter } from "./bcrypt-adapter"
import bcrypt from 'bcrypt'
import { resolve } from "path"

const salt = 12;

jest.mock('bcrypt', () => ({
    async hash(): Promise<String> {
        return new Promise(resolve => resolve("valid_hash"))
    },
    async compare(): Promise<boolean> {
        return new Promise(resolve => resolve(true))
    }
}))

const makeSut = (): BcryptAdapter => {
    const sut = new BcryptAdapter(salt)
    return sut
}

describe("Bcrypt Adapter", () => {
    test("Should call hash with correct value", async () => {
        const salt = 12;
        const sut = new BcryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash("any_value")
        expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
    })

    test("Should return a valid hash on hash success ", async () => {
        const sut = makeSut()
        const hash = await sut.hash("any_value")
        expect(hash).toBe("valid_hash")
    })

    test("Should throw when hash throws", async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
            throw new Error()
        })

        const promisse = sut.hash("any_value")
        expect(promisse).rejects.toThrow()
    })

    test("Should call compare with correct value", async () => {
        const sut = new BcryptAdapter(salt)
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        await sut.compare("any_value", "any_hash")
        expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash")
    })

})