export const badRequestResponse ={
    description: "Bad Request",
    content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/errorAPI",
          },
          example:{
            statusCode:400,
            body:{
                message: "Algo de errado na sua requisição"
            }
          }
        },
        
      }
  }