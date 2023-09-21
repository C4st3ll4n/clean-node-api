import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class LogErrorMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const logCollection = MongoHelper.getCollection("logs");
    await logCollection.insertOne({ stack, date: new Date() });
  }
}
