export const serverErrorResponse ={
    description: "Not Found",
    content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/errorAPI",
          },
          example:{
            statusCode:500,
            body:{
                message: "Internal Server Error"
            }
          }
        },
        
      }
  }