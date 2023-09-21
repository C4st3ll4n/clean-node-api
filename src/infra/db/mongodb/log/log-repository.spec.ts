import { MongoHelper } from "../helpers/mongo-helper"
import { LogErrorMongoRepository } from "./log-repository"

const makeSut = (): LogErrorMongoRepository => {
    return new LogErrorMongoRepository()
}
describe("Log Error Mongo Repository", () => {

    let logCollection

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })


    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async()=>{
        logCollection = MongoHelper.getCollection("logs")
        await logCollection.deleteMany({})
    })

    test("Should log an error with success", async () => {
        const sut = makeSut()
    
        await sut.logError("any_stack")

        const count = await logCollection.countDocuments()
        expect(count).toBe(1)
    })
})