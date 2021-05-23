import "module-alias/register";
import * as express from "express";
import {RequestWithUser, ensureAuthenticatedFirebase} from "@src/middlewares";

export const car = express();

car.use(ensureAuthenticatedFirebase);

car.post("/", (req: RequestWithUser, res) => {
    const user = req.user;
    if (user == undefined) {
        res.sendStatus(403);
        return;
    }

    console.log(user);
    res.send(`Creating car... ${user.email}`);
});

car.get("/", (req: RequestWithUser, res) => {
    const user = req.user;
    if (user == undefined) {
        res.sendStatus(403);
        return;
    }

    console.log(user);
    res.send("Hello World");
});

