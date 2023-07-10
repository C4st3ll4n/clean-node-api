export class EmailInUseError extends Error {
    constructor (){
        super(`Forbidden`)
        this.name = "EmailInUse"
    }
}