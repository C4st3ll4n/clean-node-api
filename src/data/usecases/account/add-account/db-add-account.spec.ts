import {
  AccountModel,
  AddAccountParam,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(null))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAccountData = (): AddAccountParam => ({
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password",
});

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new HasherStub();
};

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParam): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub();
  const addAccountRepositoryStub = makeAddAccountRepositoryStub();
  const loadAccountByEmailRepositoryStub = makeLoadAccountStub();
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

      await sut.add(makeFakeAccountData());
      expect(hasherSpy).toBeCalledWith("valid_password");
    });

    test("Should throw if Hasher throws", async () => {
      const { sut, hasherStub } = makeSut();
      jest
        .spyOn(hasherStub, "hash")
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        );
      const promise = sut.add(makeFakeAccountData());
      await expect(promise).rejects.toThrow();
    });
  });

  describe("AddAccountRepository", () => {
    test("Should call AddAccountRepository with correct values", async () => {
      const { sut, addAccountRepositoryStub } = makeSut();
      const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

      await sut.add(makeFakeAccountData());
      expect(addSpy).toBeCalledWith({
        name: "valid_name",
        email: "valid_email",
        password: "hashed_password",
      });
    });

    test("Should throw if AddAccountRepository throws", async () => {
      const { sut, addAccountRepositoryStub } = makeSut();
      jest
        .spyOn(addAccountRepositoryStub, "add")
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        );

      const promise = sut.add(makeFakeAccountData());
      await expect(promise).rejects.toThrow();
    });

    test("Should return an account on success", async () => {
      const { sut } = makeSut();

      const account = await sut.add(makeFakeAccountData());
      expect(account).toEqual(makeFakeAccount());
    });
  });

  describe("LoadAccountByEmailRepository", () => {
    test("Should call LoadAccountByEmailRepository with correct email", async () => {
      const { sut, loadAccountByEmailRepositoryStub } = makeSut();

      const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
      await sut.add(makeFakeAccount());

      expect(loadSpy).toHaveBeenCalledWith("valid_email");
    });
  });

  test("Should return null when LoadAccountByEmailRepository not returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail").mockReturnValueOnce(
      new Promise(resolve=>resolve(makeFakeAccount()))
    )

    const account = await sut.add(makeFakeAccountData());
    expect(account).toBeNull();
  });
});
