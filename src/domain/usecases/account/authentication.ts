import {AuthenticationModel} from "@/domain/models/authentication";
export type AuthParam = {
    email: string,
    password: string
}

export interface Authentication {
    auth(authentication: AuthParam): Promise<AuthenticationModel>
}