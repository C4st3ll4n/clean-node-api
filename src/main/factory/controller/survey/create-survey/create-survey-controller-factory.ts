import { CreateSurveyController } from "@/presentation/controllers/survey/create-survey/create-survey-controller";
import { makeDBAddSurvey } from "../../../usecase/survey/db-add-survey-factory";
import { makeCreateSurveyValidation } from "./create-survey-validation-factory";

export const makeCreateSurveyController = (): CreateSurveyController => {
    return new CreateSurveyController(makeCreateSurveyValidation(), makeDBAddSurvey())
}