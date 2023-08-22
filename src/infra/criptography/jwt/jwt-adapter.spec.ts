import jwt from "jsonwebtoken";
import { JWTAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  async sign(): Promise<string> {
    return "hashed_token";
  },
  async verify(): Promise<string> {
    return "unhashed_token";
  },
}));

const makeSut = (): JWTAdapter => {
  const secret = "secret";
  const sut = new JWTAdapter(secret);
  return sut;
};

describe("JWT adapter", () => {
  describe("Encrypt", () => {
    test("Should call sign with correct values", async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, "sign");
      await sut.encrypt("any_id");
      expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
    });

    test("Should throw when jwt throws", async () => {
      const sut = makeSut();
      jest.spyOn(sut, "encrypt").mockImplementationOnce(() => {
        return new Promise(() => new Error());
      });
      const promise = sut.encrypt("any_value");
      expect(promise).rejects.toThrow();
    });

    test("Should return a valid token on sign success", async () => {
      const sut = makeSut();
      const token = await sut.encrypt("any_id");
      expect(token).toBe("hashed_token");
    });
  });

  describe("Decrypt", () => {
    test("Should call verify with correct values", async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, "verify");
      await sut.decrypt("any_token");
      expect(verifySpy).toHaveBeenCalledWith("any_token", "secret");
    });
    
    test("Should return a valid token on verify success", async () => {
      const sut = makeSut();
      const token = await sut.decrypt("any_id");
      expect(token).toBe("unhashed_token");
    });

    test("Should return a valid token on sign success", async () => {
      const sut = makeSut();
      const token = await sut.encrypt("any_id");
      expect(token).toBe("hashed_token");
    });
  });
});
