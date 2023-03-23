import { MongoHelper } from "../helpers/mongo-helper"
import { LogErrorMongoRepository } from "./log"

const makeSut = (): LogErrorMongoRepository => {
    return new LogErrorMongoRepository()
}
describe("Log Error Mongo Repository", () => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })


    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async()=>{
        const accountCollection = await MongoHelper.getCollection("logs")
        await accountCollection.deleteMany({})
    })

    test("Should log an error with success", async () => {
        const sut = makeSut()
    
        await sut.log("any_stack")
        
    })
})