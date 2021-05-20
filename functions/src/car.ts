import * as express from "express";

export const car = express();

car.post("/", (req, res) => {
    res.send("Creating car...");
});

car.get("/", (req, res) => {
    res.send("Hello World");
});

