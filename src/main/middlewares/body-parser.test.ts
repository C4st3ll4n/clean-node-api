import request  from "supertest";
import app from "../config/app";

describe("Body Parser Middleware", () => {
    test("Should parse body as json", async()=> {
        app.post("/test_body_parser", (req, res)=> {
            console.log(req);
            res.send(req.body)
            console.log(res);
        })

        

        await request(app)
        .post("/test_body_parser")
        .send({name:"Rafael"})
        .expect({name:"Rafael"})
    })
})