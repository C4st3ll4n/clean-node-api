import request  from "supertest";
import app from "../config/app";

describe("NoCache Middleware", () => {
    test("Should enable NoCache", async()=> {
        app.get("/test_nocache", (req, res)=> {
            res.send()
        })
        await request(app)
        .get("/test_nocache")
        .expect("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
        .expect("Expires", "0")
        .expect("Surrogate-Control", "no-store")

    })
})