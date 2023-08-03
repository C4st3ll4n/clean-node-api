export const notFoundResponse ={
    description: "Not Found",
    content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/errorAPI",
          },
          example:{
            statusCode:404,
            body:{
                message: "Não encontrado"
            }
          }
        },
        
      }
  }