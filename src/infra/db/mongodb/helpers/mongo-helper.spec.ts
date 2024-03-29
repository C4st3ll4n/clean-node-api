import { MongoHelper as sut} from "./mongo-helper"

describe("Mongo Helper", ()=>{
    beforeAll(async()=>{
        await sut.connect(process.env.MONGO_URL)
    })
    afterAll(async ()=>{
        await sut.disconnect()
    })

    test("Should reconnect if mongodb is down", async () =>{
        var collection = await sut.getCollection("account")
        expect(collection).toBeTruthy()
        await sut.disconnect()
        var collection2 = await sut.getCollection("account")
        expect(collection2).toBeTruthy()
    })
})