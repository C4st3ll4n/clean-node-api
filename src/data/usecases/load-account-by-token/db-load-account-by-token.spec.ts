import { Decrypter } from "../../protocols/criptography/decrypter";
import {DBLoadAccountByToken} from "./db-load-account-by-token";

interface SUTTypes {
  sut: DBLoadAccountByToken;
  decrypterStub: Decrypter;
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("any_value"));
    }
  }
  return new DecrypterStub();
};

const makeSUT = (): SUTTypes => {
  const decrypterStub = makeDecrypterStub();
  const sut = new DBLoadAccountByToken(decrypterStub);

  return {
    sut,
    decrypterStub,
  };
};

describe("DB Load Account By Token", () => {
  test("Should call Decrypter correctly", async () => {
    const { sut, decrypterStub } = makeSUT();

    const decrypterSpy = jest.spyOn(decrypterStub, "decrypt");
    await sut.load("any_token", "any_role");

    expect(decrypterSpy).toHaveBeenCalledWith("any_token", "any_role");
  });

  test("Should return null when Decrypter return null", async ()=>{
    const { sut, decrypterStub } = makeSUT();
    jest.spyOn(decrypterStub, "decrypt").mockReturnValueOnce(new Promise((resolve, reject) => resolve(null)));
    const promise = await sut.load("any_token", "any_role");
    expect(promise).toBeNull()
  },)

});
