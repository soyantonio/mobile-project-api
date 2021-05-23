import "module-alias/register";
import * as express from "express";
import firebase from "firebase/app";
import "firebase/auth";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd";
import {ILogin, IRegister} from "./user.type";

const ajv = new Ajv();

export const user = express();

const loginSchema: JTDSchemaType<ILogin> = {
    properties: {
        email: {type: "string"},
        password: {type: "string"},
    },
};

const registerSchema: JTDSchemaType<IRegister> = {
    properties: {
        email: {type: "string"},
        password: {type: "string"},
    },
};

user.post("/", async (req, res): Promise<void> => {
    const validateRegister = ajv.compile(registerSchema);
    if (!validateRegister(req.body)) {
        res.status(400).send(validateRegister.errors).end();
        return;
    }
    const payload: IRegister = req.body as IRegister;

    try {
        const userCredential = await firebase.auth()
            .createUserWithEmailAndPassword(payload.email, payload.password);
        res.send({
            token: await userCredential.user?.getIdToken(),
        });
    } catch (e) {
        res.status(401).send({
            message: e.message,
        });
    }
});

user.post("/login", async (req, res): Promise<void> => {
    const validateLogin = ajv.compile(loginSchema);
    if (!validateLogin(req.body)) {
        res.status(400).send(validateLogin.errors).end();
        return;
    }

    const payload: ILogin = req.body as ILogin;

    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(
            payload.email,
            payload.password
        );
        res.send({
            token: await userCredential.user?.getIdToken(),
        });
    } catch (e) {
        res.status(401).send({
            message: "Could not sign in",
        });
    }
});
