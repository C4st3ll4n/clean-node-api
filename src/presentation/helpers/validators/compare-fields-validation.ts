import { InvalidParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export class CompareFieldsValidation implements Validation{

    constructor(fieldName:string, fieldToCompare:string){
        this.fieldName = fieldName
        this.fieldToCompareName = fieldToCompare
    }

    private readonly fieldName:string

    private readonly fieldToCompareName:string

    validate(input: any): Error {
        if(input[this.fieldName] !== input[this.fieldToCompareName]){
            return new InvalidParamError(this.fieldToCompareName)
        }
    }

}