export const noContentResponse ={
    description: "Bad Request",
    content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/errorAPI",
          },
          example:{
            statusCode:204,
            body:{}
          }
        },
        
      }
  }