import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account-mongo-repository";
import { Collection } from "mongodb";
import {mockAccountParam} from "@/domain/test";
const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

let accountCollection: Collection;

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("add", () => {
    test("Should return an account on add success", async () => {
      const sut = makeSut();
      const account = await sut.add(mockAccountParam());
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email");
      expect(account.password).toBe("any_password");
    });
  });
  describe("load", () => {
    describe("by email", ()=>{
      test("Should return an account on loadByEmail success", async () => {
        const sut = makeSut();
        await accountCollection.insertOne({
          name: "any_name",
          email: "any_email@email.com",
          password: "any_password",
        });
        const account = await sut.loadByEmail("any_email@email.com");
        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe("any_name");
        expect(account.email).toBe("any_email@email.com");
        expect(account.password).toBe("any_password");
      });
  
      test("Should return null if loadByEmail fails", async () => {
        const sut = makeSut();
        const account = await sut.loadByEmail("any_email@email.com");
        expect(account).toBeFalsy();
      });
    })

    describe("by token", ()=>{
      test("Should return an account on loadByToken without role", async () => {
        const sut = makeSut();
        await accountCollection.insertOne({
          name: "any_name",
          email: "any_email@email.com",
          password: "any_password",
          accessToken: "any_token"
        });
        const account = await sut.loadByToken("any_token");
        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe("any_name");
        expect(account.email).toBe("any_email@email.com");
        expect(account.password).toBe("any_password");
      });

      test("Should return an account on loadByToken with admin role", async () => {
        const sut = makeSut();
        await accountCollection.insertOne({
          name: "any_name",
          email: "any_email@email.com",
          password: "any_password",
          accessToken: "any_token",
          role: "any_role"
        });
        const account = await sut.loadByToken("any_token", "any_role");
        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe("any_name");
        expect(account.email).toBe("any_email@email.com");
        expect(account.password).toBe("any_password");
      });
  
  
      test("Should return null if loadByToken fails with invalid", async () => {
        const sut = makeSut();
        const account = await sut.loadByToken("any_token");
        expect(account).toBeFalsy();
      });

      test("Should return an account on loadByToken if user is admin ", async () => {
        const sut = makeSut();
        await accountCollection.insertOne({
          name: "any_name",
          email: "any_email@email.com",
          password: "any_password",
          accessToken: "any_token",
          role: "admin"
        });
        const account = await sut.loadByToken("any_token");
        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe("any_name");
        expect(account.email).toBe("any_email@email.com");
        expect(account.password).toBe("any_password");
      });
    })
  });
  describe("update", () => {
    test("Should update the account accessToken on updateAccessToken success", async () => {
      const sut = makeSut();
      const fakeAccount = await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      });
      expect(fakeAccount.ops[0].accessToken).toBeFalsy();
      await sut.updateAccessToken(fakeAccount.ops[0]._id, "any_token");
      const account = await accountCollection.findOne({
        _id: fakeAccount.ops[0]._id,
      });
      expect(account).toBeTruthy();
      expect(account.accessToken).toBe("any_token");
    });
  });
});
