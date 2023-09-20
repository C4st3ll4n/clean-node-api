import { AccountModel } from "@/domain/models/account";
import {SurveyResultModel} from "@/domain/models/survey-result";

export interface LoadAccountByTokenRepository{
    loadByToken(accessToken: string, role?:string): Promise<LoadAccountByTokenRepository.Result>
    loadAccountIdByToken(accessToken: string, role?:string): Promise<LoadAccountByTokenRepository.AccountIdResultResult>
}

export namespace LoadAccountByTokenRepository {
    export type Result = AccountModel
    export type AccountIdResultResult = {
        id: string
    }
}