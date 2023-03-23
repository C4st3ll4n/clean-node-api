import { LogErrorRepository } from "../../../../data/protocols/log-error-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class LogErrorMongoRepository implements LogErrorRepository {
    async log(stack:string): Promise<void> {
        const logCollection = await MongoHelper.getCollection("logs")
        
        const result = await logCollection.insertOne(stack)

        
    }

}