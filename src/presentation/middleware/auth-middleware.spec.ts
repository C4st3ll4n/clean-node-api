import { HttpRequest } from "../protocols";
import { forbidden, ok } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../errors";
import { AuthMiddleware } from "./auth-middleware";
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccountModel } from "../../domain/models/account";

interface SUTTypes {
  sut: AuthMiddleware;
  loadAccountTokenStub: LoadAccountByToken;
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    "x-access-token": "any_token",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password",
});

const makeLoadAccountTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    load(token: string, role?: string | undefined): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new LoadAccountByTokenStub();
};

const makeSUT = (): SUTTypes => {
  const loadAccountTokenStub = makeLoadAccountTokenStub();
  const sut = new AuthMiddleware(loadAccountTokenStub);

  return { sut, loadAccountTokenStub };
};

describe("Auth Middleware", () => {
  test("Should return 403 when no x-access-token is provided on headers", async () => {
    const { sut } = makeSUT();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Ensure AuthMiddleware calls LoadAccountByToken correctly", async () => {
    const { sut, loadAccountTokenStub } = makeSUT();
    const loadSpy = jest.spyOn(loadAccountTokenStub, "load");

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(loadSpy).toHaveBeenCalledWith("any_token");
  });

  test("Should return 403 if LoadAccountByToken returns null", async () => {
    const { sut, loadAccountTokenStub } = makeSUT();
    jest.spyOn(loadAccountTokenStub, "load").mockReturnValueOnce(new  Promise(resolve => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
  
  
  test("Should return 200 when LoadAccountByToken returns an account", async () => {
    const { sut } = makeSUT();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accountId: "valid_id"}));
  });
});
