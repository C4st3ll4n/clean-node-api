export type AuthParam = {
    email: string,
    password: string
}

export interface Authentication {
    auth(authentication: AuthParam): Promise<string>
}