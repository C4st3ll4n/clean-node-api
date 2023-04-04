import { InvalidParamError, MissingParamError } from "../../errors";
import { Validation } from "./validation";

export class CompareFieldsValidation implements Validation{

    private readonly field:string

    private readonly fieldToCompare:string

    validate(input: any): Error {
        if(input[this.field] != input[this.fieldToCompare]){
            return new InvalidParamError("")
        }
    }

}