import {AddAccountRepository} from "@/data/protocols/db/account/add-account-repository";
import {LoadAccountByEmailRepository} from "@/data/protocols/db/account/load-account-by-email-repository";
import {UpdateAcessTokenRepository} from "@/data/protocols/db/account/update-access-token-repository";
import {AccountModel} from "@/domain/models/account";
import {AddAccountModel} from "@/domain/usecases/add-account";
import {LoadAccountByToken} from "@/domain/usecases/load-account-by-token";
import {MongoHelper} from "../helpers/mongo-helper";

const ObjectId = require("mongodb").ObjectId;

export class AccountMongoRepository
    implements AddAccountRepository,
        LoadAccountByEmailRepository,
        UpdateAcessTokenRepository,
        LoadAccountByToken {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts");
        const result = await accountCollection.insertOne(accountData);

        const account = await accountCollection.findOne({
            _id: result.insertedId,
        });

        const {_id, ...accountWithoutId} = account;

        return {
            id: _id.toString(),
            name: accountWithoutId["name"],
            email: accountWithoutId["email"],
            password: accountWithoutId["password"],
        };
    }

    async loadByEmail(email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts");
        const account = await accountCollection.findOne({email});
        if (account != undefined) {
            const {_id, ...accountWithoutId} = account;

            return {
                id: _id.toString(),
                name: accountWithoutId["name"],
                email: accountWithoutId["email"],
                password: accountWithoutId["password"],
            };
        }

        return null;
    }

    async updateAccessToken(identifier: string, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection("accounts");
        await accountCollection.updateOne(
            {
                _id: new ObjectId(identifier),
            },
            {
                $set: {
                    accessToken: token,
                },
            }
        );
    }

    async loadByToken(token: string, role?: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts");
        const account = await accountCollection.findOne({
            accessToken: token,
            $or: [{
                role
            }, {
                role: "admin"
            }]
        });
        if (account != undefined) {
            const {_id, ...accountWithoutId} = account;

            return {
                id: _id.toString(),
                name: accountWithoutId["name"],
                email: accountWithoutId["email"],
                password: accountWithoutId["password"],
            };
        }

        return null;
    }
}
