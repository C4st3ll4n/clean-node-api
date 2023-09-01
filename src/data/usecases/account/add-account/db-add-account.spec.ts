import {
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository, AccountModel,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";
import {mockAccount, mockAccountParam, throwError} from "@/domain/test";
import {makeAddAccountRepositoryStub, makeHasherStub, makeLoadAccountStub} from "@/data/test";

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountStub();
  jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail").mockReturnValue(new Promise((resolve)=>resolve(null)))

  const hasherStub = makeHasherStub();
  const addAccountRepositoryStub = makeAddAccountRepositoryStub();


  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub);

  return {
    sut,
    hasherStub: hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  };
};

describe("DbAddAccount Usecase", () => {
  describe("Hasher", () => {
    test("Should call Hasher with correct password", async () => {
      const { sut, hasherStub: hasherStub } = makeSut();
      const hasherSpy = jest.spyOn(hasherStub, "hash");

      await sut.add(mockAccountParam());
      expect(hasherSpy).toBeCalledWith("any_password");
    });

    test("Should throw if Hasher throws", () => {
      const { sut, hasherStub } = makeSut();
      jest
        .spyOn(hasherStub, "hash")
        .mockImplementationOnce(throwError);
      const promise = sut.add(mockAccountParam());
      expect(promise).rejects.toThrow();
    });
  });

  describe("AddAccountRepository", () => {
    test("Should call AddAccountRepository with correct values", async () => {
      const { sut, addAccountRepositoryStub } = makeSut();
      const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

      await sut.add(mockAccountParam());
      expect(addSpy).toBeCalledWith({
        name: "any_name",
        email: "any_email",
        password: "hashed_password",
      });
    });

    test("Should throw if AddAccountRepository throws", async () => {
      const { sut, addAccountRepositoryStub } = makeSut();
      jest
        .spyOn(addAccountRepositoryStub, "add")
        .mockImplementationOnce(throwError);

      const promise = sut.add(mockAccountParam());
      await expect(promise).rejects.toThrow();
    });

    test("Should return an account on success", async () => {
      const { sut } = makeSut();

      const account = await sut.add(mockAccountParam());
      expect(account).toEqual(mockAccount());
    });
  });

  describe("LoadAccountByEmailRepository", () => {
    test("Should call LoadAccountByEmailRepository with correct email", async () => {
      const { sut, loadAccountByEmailRepositoryStub } = makeSut();

      const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
      await sut.add(mockAccount());

      expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
    });
  });

  test("Should return null when LoadAccountByEmailRepository not returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail").mockReturnValueOnce(
        Promise.resolve(mockAccount())
    )

    const account = await sut.add(mockAccountParam());
    expect(account).toBeNull();
  });
});
