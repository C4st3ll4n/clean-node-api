export const forbiddenResponse ={
    description: "Not Found",
    content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/errorAPI",
          },
          example:{
            statusCode:403,
            body:{
                message: "Acesso restrito"
            }
          }
        },
        
      }
  }