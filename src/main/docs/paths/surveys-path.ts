export const suveysPath = {
  get: {
    tags: ["surveys"],
    security: [
      {apiKeyAuth:[]}
    ],
    summary: "Load Surveys",
    description: "Endpoint para listar as enquetes",
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/surveys",
            },
          },
        },
      },
      400:{
        $ref:"#/responses/badRequest"
      },
      403:{
        $ref:"#/responses/forbidden"
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
