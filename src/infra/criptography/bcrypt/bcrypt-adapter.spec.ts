import { BcryptAdapter } from "./bcrypt-adapter";
import bcrypt from "bcrypt";
import {throwError} from "@/domain/test";

const salt = 12;

jest.mock("bcrypt", () => ({
  async hash(): Promise<String> {
    return new Promise((resolve) => resolve("valid_hash"));
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt);
  return sut;
};

describe("Bcrypt Adapter", () => {
  describe("hash", () => {
    test("Should call hash with correct value", async () => {
      const salt = 12;
      const sut = new BcryptAdapter(salt);
      const hashSpy = jest.spyOn(bcrypt, "hash");
      await sut.hash("any_value");
      expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
    });

    test("Should return a valid hash on hash success ", async () => {
      const sut = makeSut();
      const hash = await sut.hash("any_value");
      expect(hash).toBe("valid_hash");
    });

    test("Should throw when hash throws", async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, "hash").mockImplementationOnce(throwError)

      const promise = sut.hash("any_value");
      expect(promise).rejects.toThrow();
    });
  });

  describe("compare", () => {
    test("Should call compare with correct value", async () => {
      const sut = new BcryptAdapter(salt);
      const compareSpy = jest.spyOn(bcrypt, "compare");
      await sut.compare("any_value", "any_hash");
      expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
    });

    test("Should return true on valid comparison", async () => {
      const sut = makeSut();
      const isValid = await sut.compare("any_value", "any_hash");
      expect(isValid).toBe(true);
    });

    test("Should return false on valid comparison", async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => false);
      const isValid = await sut.compare("any_value", "any_hash");
      expect(isValid).toBe(false);
    });

    test("Should throw when compare throws", async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, "compare").mockImplementationOnce(throwError)

      const promise = sut.compare("any_value", "any_hash");
      expect(promise).rejects.toThrow();
    });
  });
});
