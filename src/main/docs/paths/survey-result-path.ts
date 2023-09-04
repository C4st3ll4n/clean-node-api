export const surveyResultPath = {
  put: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ["surveys"],
    summary: "Responder enquete",
    description: "Endpoint para criar uma resposta de enquete",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/addSurveyResult",
          },
        },
      },
    },
    parameters:[{
      in: "path",
      name:"surveyId",
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/surveyResult",
            },
          },
        },
      },
      400:{
        $ref:"#/responses/badRequest"
      },
      401:{
        $ref:"#/responses/unauthorized"
      },
      404:{
        $ref:"#/responses/notFound"
      },
      500:{
        $ref:"#/responses/serverError"
      },
    },
  },
};
