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
    await sut.load("any_token");

    expect(decrypterSpy).toHaveBeenCalledWith("any_token");
  });
});
