export type AuthModel = {
    email: string,
    password: string
}

export interface Authentication {
    auth(authentication: AuthModel): Promise<string>
}