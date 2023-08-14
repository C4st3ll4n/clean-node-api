import { Decrypter } from "../../protocols/criptography/decrypter";
import { LoadAccountByTokenRepository } from "../../protocols/db/account/load-account-by-token-repository";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { DBLoadAccountByToken } from "./db-load-account-by-token";

interface SUTTypes {
  sut: DBLoadAccountByToken;
  decrypterStub: Decrypter;
  repositoryStub: LoadAccountByTokenRepository;
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }
  return new DecrypterStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password",
});

const makeRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};

const makeSUT = (): SUTTypes => {
  const repositoryStub = makeRepositoryStub();
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
    const { sut, decrypterStub } = makeSUT();

    const decrypterSpy = jest.spyOn(decrypterStub, "decrypt");
    await sut.loadByToken("any_token", "any_role");

    expect(decrypterSpy).toHaveBeenCalledWith("any_token");
  });

  test("Should return null when Decrypter return null", async () => {
    const { sut, decrypterStub } = makeSUT();
    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(null)));
    const promise = await sut.loadByToken("any_token");
    expect(promise).toBeNull();
  });
  
  test("Should throw when Decrypter throws", ()=>{
    const { sut, decrypterStub } = makeSUT();
    jest.spyOn(decrypterStub, "decrypt").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.loadByToken("any_token", "any_role");
    expect(promise).rejects.toThrow()
  },)
  

  test("Should call LoadAccountByTokenRepository correctly", async () => {
    const { sut, repositoryStub } = makeSUT();

    const repositorySpy = jest.spyOn(repositoryStub, "loadByToken");
    await sut.loadByToken("any_token", "any_role");

    expect(repositorySpy).toHaveBeenCalledWith("any_token", "any_role");
  });

  test("Should return null when LoadAccountByTokenRepository return null", async () => {
    const { sut, repositoryStub } = makeSUT();
    jest
      .spyOn(repositoryStub, "loadByToken")
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(null)));
    const promise = await sut.loadByToken("any_token");
    expect(promise).toBeNull();
  });

  test("Should return an account on success", async () => {
    const { sut, repositoryStub } = makeSUT();
    const account = await sut.loadByToken("any_token");
    expect(account).toEqual(makeFakeAccount())
  });

  test("Should throw when LoadAccountByTokenRepository throws", ()=>{
    const { sut, repositoryStub } = makeSUT();
    jest.spyOn(repositoryStub, "loadByToken").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.loadByToken("any_token", "any_role");
    expect(promise).rejects.toThrow()
  },)
});
