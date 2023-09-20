import { AccountModel } from "@/domain/models/account";
import {SurveyResultModel} from "@/domain/models/survey-result";

export interface LoadAccountByTokenRepository{
    loadByToken(accessToken: string, role?:string): Promise<LoadAccountByTokenRepository.Result>
}

export namespace LoadAccountByTokenRepository {
    export type Result = AccountModel
}