export const unauthorizedResponse ={
    description: "Not Found",
    content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/errorAPI",
          },
          example:{
            statusCode:401,
            body:{
                message: "Sem autorização"
            }
          }
        },
        
      }
  }