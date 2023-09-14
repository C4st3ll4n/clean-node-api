import {Decrypter} from "@/data/protocols/criptography/decrypter";
import {LoadAccountByTokenRepository} from "@/data/protocols/db/account/load-account-by-token-repository";
import {DBLoadAccountByToken} from "./db-load-account-by-token";
import {mockAccount, throwError} from "@/domain/test";
import {makeDecrypterStub, makeLoadAccountByTokenStub} from "@/data/test";

type SUTTypes = {
    sut: DBLoadAccountByToken;
    decrypterStub: Decrypter;
    repositoryStub: LoadAccountByTokenRepository;
}


const makeSUT = (): SUTTypes => {
    const repositoryStub = makeLoadAccountByTokenStub();
    const decrypterStub = makeDecrypterStub();
    const sut = new DBLoadAccountByToken(decrypterStub, repositoryStub);

    return {
        sut,
        decrypterStub,
        repositoryStub,
    };
};

describe("DB Load Account By Token", () => {
    test("Should call Decrypter correctly", async () => {
        const {sut, decrypterStub} = makeSUT();

        const decrypterSpy = jest.spyOn(decrypterStub, "decrypt");
        await sut.loadByToken("any_token", "any_role");

        expect(decrypterSpy).toHaveBeenCalledWith("any_token");
    });

    test("Should return null when Decrypter return null", async () => {
        const {sut, decrypterStub} = makeSUT();
        jest
            .spyOn(decrypterStub, "decrypt")
            .mockReturnValueOnce(Promise.resolve(null));
        const promise = await sut.loadByToken("any_token");
        expect(promise).toBeNull();
    });

    test("Should throw when Decrypter throws", async() => {
        const {sut, decrypterStub} = makeSUT();
        jest.spyOn(decrypterStub, "decrypt").mockImplementationOnce(throwError)
        const account = await sut.loadByToken("any_token", "any_role");
        expect(account).toBeNull();

    },)


    test("Should call LoadAccountByTokenRepository correctly", async () => {
        const {sut, repositoryStub} = makeSUT();

        const repositorySpy = jest.spyOn(repositoryStub, "loadByToken");
        await sut.loadByToken("any_token", "any_role");

        expect(repositorySpy).toHaveBeenCalledWith("any_token", "any_role");
    });

    test("Should return null when LoadAccountByTokenRepository return null", async () => {
        const {sut, repositoryStub} = makeSUT();
        jest
            .spyOn(repositoryStub, "loadByToken")
            .mockReturnValueOnce(Promise.resolve(null));
        const promise = await sut.loadByToken("any_token");
        expect(promise).toBeNull();
    });

    test("Should return an account on success", async () => {
        const {sut} = makeSUT();
        const account = await sut.loadByToken("any_token");
        expect(account).toEqual(mockAccount())
    });

    test("Should throw when LoadAccountByTokenRepository throws", () => {
        const {sut, repositoryStub} = makeSUT();
        jest.spyOn(repositoryStub, "loadByToken").mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())));
        const promise = sut.loadByToken("any_token", "any_role");
        expect(promise).rejects.toThrow()
    },)
});
