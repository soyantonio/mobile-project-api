import * as jwt from "jwt-simple";
import * as dayjs from "dayjs";
import * as admin from "firebase-admin";
import {QuerySnapshot} from "@google-cloud/firestore";
import {Request, Response, NextFunction} from "express";
import {TOKEN_SECRET} from "./config";

enum DeviceVariant {
    Console = "console",
    Car = "car",
}

export interface Device {
    _id: string;
    _createdBy: string;
    name: string;
    bluetoothAddress: string;
    variant: DeviceVariant
}

export interface RequestWithUser extends Request {
    user?: admin.auth.UserRecord;
}

export type RequestWithDevice<T> = T & {
    device?: Device;
}

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

const db = admin.firestore();
db.settings({
    timestampsInSnapshots: true,
});
const devicesRef = db.collection("devices");

const getDevice = (deviceId: string): Promise<QuerySnapshot> =>
    devicesRef.where("_id", "==", deviceId).limit(1).get();

export const ensureDevice = async (
    req: RequestWithDevice<RequestWithUser>, res: Response, next: NextFunction
): Promise<void> => {
    const deviceId = req.params.deviceId;
    if (!deviceId) {
        res.status(403).send({
            message: "Missing device id",
        });
        return;
    }
    await getDevice(deviceId);

    console.log("Hola");
    next();
};
