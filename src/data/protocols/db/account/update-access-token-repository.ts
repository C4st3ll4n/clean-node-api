export interface UpdateAcessTokenRepository{
    updateAccessToken(identifier:string, token:string): Promise<void>
}