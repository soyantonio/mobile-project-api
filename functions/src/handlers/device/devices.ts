import {HandlerWithUser} from "./types";

export const createDeviceHandler:HandlerWithUser = async (req, res) => {
    const user = req.user;
    if (user == undefined) {
        res.sendStatus(403);
        return;
    }

    console.log(user);
    res.send(`Creating device... ${user.email}`);
};

export const findDeviceById:HandlerWithUser = async (req, res) => {
    const user = req.user;
    if (user == undefined) {
        res.sendStatus(403);
        return;
    }

    console.log(user);
    res.send("Hello World");
};
