import {
    Controller,
    HttpRequest,
    Validation,
} from "../../../protocols";
import {CreateSurveyController} from "./create-survey-controller";
import {badRequest, noContent, serverError} from "../../../helpers/http/http-helper";
import {AddSurvey} from "./create-survey-protocols";
import * as mockdate from "mockdate";
import {makeValidationStub} from "@/validation/test";

type SUTTypes ={
    sut: Controller;
    validationStub: Validation;
    addSurveyStub: AddSurvey;
}

const makeAddSurveyStub = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
        async add(input: AddSurvey.Param): Promise<void> {
            return Promise.resolve();
        }
    }

    return new AddSurveyStub();
};

const makeFakeRequest = (): CreateSurveyController.Request => ({
        question: "any_question",
        answers: [{image: "any_image", answer: "any_answer"}],
});

const makeSut = (): SUTTypes => {
    const validationStub = makeValidationStub();
    const addSurveyStub = makeAddSurveyStub();
    const sut = new CreateSurveyController(validationStub, addSurveyStub);

    return {
        sut,
        validationStub,
        addSurveyStub,
    };
};

describe("CreateSurvey Controller", () => {

    beforeAll(()=>{
        mockdate.set(new Date())
    })

    test("Should call Validation with correct values", async () => {
        const {sut, validationStub} = makeSut();

        const validateSpy = jest.spyOn(validationStub, "validate");
        const httpRequest = makeFakeRequest();

        await sut.handle(httpRequest);

        expect(validateSpy).toBeCalledWith(httpRequest);
    });

    test("Should return 400 when Validation fails", async () => {
        const {sut, validationStub} = makeSut();

        jest.spyOn(validationStub, "validate").mockImplementationOnce(() => {
            return new Error("");
        });
        const httpRequest = makeFakeRequest();

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new Error("")));
    });

    test("Should call AddSurvey with correct values", async () => {
        const {sut, addSurveyStub} = makeSut();

        const addSpy = jest.spyOn(addSurveyStub, "add");
        const httpRequest = makeFakeRequest();

        await sut.handle(httpRequest);


        expect(addSpy).toBeCalledWith({...httpRequest, date: new Date()});
    });

    test("Should return 500 when AddSurvey fails", async () => {
        const {sut, addSurveyStub} = makeSut();

        jest.spyOn(addSurveyStub, "add").mockImplementationOnce(() => {
            return new Promise((resolve, reject) => reject(new Error()));
        });
        const httpRequest = makeFakeRequest();

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(serverError(new Error()));
    });

    test("Should return 204 when on success", async () => {
        const {sut} = makeSut();
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(noContent());
    });
});
