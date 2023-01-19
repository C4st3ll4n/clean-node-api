import express  from "express";

const app = express()
app.listen(
    5050, ()=> console.log("Running on port 5050")
)