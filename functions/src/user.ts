import * as express from "express";
import * as admin from "firebase-admin";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd";
import {createToken} from "./services";

const ajv = new Ajv();

export const user = express();

interface ILogin {
    email: string
    password: string
}


interface IRegister {
    id: string
    email: string
    password: string
}

const loginSchema: JTDSchemaType<ILogin> = {
    properties: {
        email: {type: "string"},
        password: {type: "string"},
    },
};


const registerSchema: JTDSchemaType<IRegister> = {
    properties: {
        id: {type: "string"},
        email: {type: "string"},
        password: {type: "string"},
    },
};

user.post("/", (req, res) => {
    const validateRegister = ajv.compile(registerSchema);
    if (!validateRegister(req.body)) {
        res.status(400).send(validateRegister.errors).end();
        return;
    }
    const payload: IRegister = req.body as IRegister;

    res.send({
        token: createToken("helloWorld"),
    });
});

user.post("/login", (req, res) => {
    const validateLogin = ajv.compile(loginSchema);
    if (!validateLogin(req.body)) {
        res.status(400).send(validateLogin.errors).end();
        return;
    }

    const payload: ILogin = req.body as ILogin;
    console.log(payload);

    res.send({
        token: createToken("helloWorld"),
    });
});
