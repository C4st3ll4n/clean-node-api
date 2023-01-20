import request  from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";

describe("Signup Route", () => {
    test("Should return an account on success", async()=> {
        await request(app)
        .post("/api/signup")
        .send({
            name:"Fulano",
            email: "dulagno@gmail.com",
            password:"123445",
            confirmPassword: "123445"
        })
        .expect(200)
    })
})