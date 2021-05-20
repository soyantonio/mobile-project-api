import * as express from "express";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd";
import {createToken} from "./services";

const ajv = new Ajv();

export const user = express();

interface ILogin {
    username: string
    password: string
}

const loginSchema: JTDSchemaType<ILogin> = {
    properties: {
        username: {type: "string"},
        password: {type: "string"},
    },
};

user.post("/login", (req, res) => {
    const validateLogin = ajv.compile(loginSchema);
    if (!validateLogin(req.body)) {
        res.status(400).send(validateLogin.errors).end();
        return;
    }

    const loginPayload: ILogin = req.body as ILogin;
    console.log(loginPayload);

    res.send({
        token: createToken("helloWorld"),
    });
});
