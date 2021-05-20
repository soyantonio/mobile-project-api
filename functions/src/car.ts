import * as express from "express";
import {RequestWithUser, ensureAuthenticated} from "./middlewares";

export const car = express();

car.use(ensureAuthenticated);
car.post("/", (req: RequestWithUser, res) => {
    const user = req.user;
    if (user == undefined) {
        res.sendStatus(403);
        return;
    }

    console.log(user);
    res.send(`Creating car... ${user}`);
});

car.get("/", (req, res) => {
    res.send("Hello World");
});

