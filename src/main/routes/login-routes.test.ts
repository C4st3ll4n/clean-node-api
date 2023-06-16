import request  from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { hash } from "bcrypt";

let accountCollection;

describe("Login Route", () => {
    beforeAll(async()=>{
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async()=>{
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })

    describe("POST /signup", ()=>{

        test("Should return 201 account on success", async()=> {
            await request(app)
            .post("/api/signup")
            .send({
                name:"Fulano",
                email: "dulagno@gmail.com",
                password:"123",
                passwordConfirmation: "123"
            })
            .expect(201)
        })
    })

    describe("POST /login", ()=>{

        test("Should return 200 account on success", async()=> {
            const password = await hash("123", 12);
            await accountCollection.insertOne({
                name: "Fulano",
                email: "dulagno@gmail.com",
                password:password,
            })

            await request(app)
            .post("/api/login")
            .send({
                email: "dulagno@gmail.com",
                password:"123",
            })
            .expect(200)
        })
    })

})