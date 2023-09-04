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
  post: {
    tags: ["surveys"],
    security: [
      {apiKeyAuth: []}
    ],
    summary: "Create Surveys",
    description: "Endpoint para criar enquetes (acessível apenas para administradores)",
    requestBody: {
      content:{
        "application/json":{
           schema: {
             $ref: '#/schemas/add-survey'
           }
        }
      }
    },
    responses: {
      204: {
        description: "Success"
      },
      400: {
        $ref: "#/responses/badRequest"
      },
      403: {
        $ref: "#/responses/forbidden"
      },
      404: {
        $ref: "#/responses/notFound"
      },
      500: {
        $ref: "#/responses/serverError"
      },
    },
  }
};
