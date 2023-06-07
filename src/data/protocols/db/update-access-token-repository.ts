export interface UpdateAcessTokenRepository{
    update(identifier:string, token:string): Promise<void>
}