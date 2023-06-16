import { Encrypter } from "../../../data/protocols/criptography/encrypter";
import jwt from "jsonwebtoken";
export class JWTAdapter implements Encrypter {

    constructor(private readonly secret: string) {
    }
    async encrypt(value: string): Promise<string> {
        return jwt.sign({ id: value }, this.secret)
    }

}