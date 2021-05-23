import "module-alias/register";
import * as express from "express";
import {FIREBASE_CONFIG} from "@src/config";
import {RequestWithUser} from "@src/middlewares";

export const car = express();

// car.use(ensureAuthenticated);
// car.use(ensureAuthenticatedFirebase);

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
    console.log(FIREBASE_CONFIG);
    res.send("Hello World");
});

