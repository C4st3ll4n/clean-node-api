export interface TokenGenerator{
    generate(identifier:string): Promise<String>
}