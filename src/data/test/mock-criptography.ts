import {Hasher} from "@/data/protocols/criptography/hasher";
import {Encrypter} from "@/data/protocols/criptography/encrypter";
import {HashComparer} from "@/data/protocols/criptography/hash-comparer";
import {Decrypter} from "@/data/protocols/criptography/decrypter";

export const makeHasherStub = (): Hasher => {
    class HasherStub implements Hasher {
        async hash(value: string): Promise<string> {
            return new Promise((resolve) => resolve("hashed_password"));
        }
    }
    return new HasherStub();
};

export const makeHashCompareStub = (): HashComparer => {
    class HashCompareStub implements HashComparer {
        async compare(value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }
    return new HashCompareStub()
}

export const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(identifier: string): Promise<string> {
            return new Promise(resolve => resolve("valid_token"))
        }
    }

    return new EncrypterStub();
}


export const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
        decrypt(value: string): Promise<object> {
            return new Promise((resolve) => resolve({id:"any_token"}));
        }
    }

    return new DecrypterStub();
};

