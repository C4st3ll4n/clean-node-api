import {Decrypter} from "@/data/protocols/criptography/decrypter";
import {Encrypter} from "@/data/protocols/criptography/encrypter";
import jwt from "jsonwebtoken";

export class JWTAdapter implements Encrypter, Decrypter {

    constructor(private readonly secret: string) {
    }

    async encrypt(value: string): Promise<string> {
        return jwt.sign({id: value}, this.secret)
    }

    async decrypt(value: string): Promise<object> {
        return jwt.verify(value, this.secret) as any
    }

}