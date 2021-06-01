import "module-alias/register";
import * as jwt from "jwt-simple";
import * as dayjs from "dayjs";
import * as admin from "firebase-admin";
import {QuerySnapshot} from "@google-cloud/firestore";
import {Response, NextFunction} from "express";
import {devicesRef} from "@src/datastore";
import {RequestWithDevice, RequestWithUser} from "@src/middleware.types";
import {Device} from "@src/handlers/device/types";
import {TOKEN_SECRET} from "./config";


export const ensureAuthenticatedFirebase = async (
    req: RequestWithUser, res: Response, next: NextFunction
): Promise<void> => {
    if (!req.headers.authorization) {
        res.status(403).send({
            message: "Authorization header not found",
        });
        return;
    }
    const token = req.headers.authorization.split(" ")[1];

    try {
        const verifiedToken = await admin.auth().verifyIdToken(token);
        req.user = await admin.auth().getUser(verifiedToken.uid);
        next();
    } catch (e) {
        res.status(401).send({
            message: "The token has expired",
        });
        return;
    }
};

export const ensureAuthenticated = async (
    req: RequestWithUser, res: Response, next: NextFunction
): Promise<void> => {
    if (!req.headers.authorization) {
        res.status(403).send({
            message: "Authorization header not found",
        });
        return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.decode(token, TOKEN_SECRET);

    if (payload.exp <= dayjs().unix()) {
        res.status(401).send({
            message: "The token has expired",
        });
        return;
    }

    req.user = payload.sub;
    next();
};

const getDevice = (deviceId: string, userId: string): Promise<QuerySnapshot> =>
    devicesRef
        .where("_id", "==", deviceId)
        .where("_createdBy", "==", userId)
        .limit(1).get();

export const ensureDevice = async (
    req: RequestWithDevice<RequestWithUser>, res: Response, next: NextFunction
): Promise<void> => {
    const deviceId = req.params.deviceId;
    console.log(req.params);
    if (!deviceId) {
        res.status(403).send({
            message: "Missing device id",
        });
        return;
    }
    const user = req.user;
    if (user == undefined) {
        res.sendStatus(403);
        return;
    }

    try {
        req.device = (await getDevice(deviceId, user.uid))
            .docs[0].data() as Device;
        next();
    } catch {
        res.status(404).send({
            message: "Could not found device",
        });
        return;
    }
};
