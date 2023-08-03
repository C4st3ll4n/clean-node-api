export const loginPath = {
  post: {
    tags: ["login"],
    symmary: "Login",
    description: "Endpoint para autenticar o usuário",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/login",
          },
        },
      },
    },
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/account",
            },
          },
        },
      },
      400:{
        $ref:"#/responses/badRequest"
      }
    },
  },
};
