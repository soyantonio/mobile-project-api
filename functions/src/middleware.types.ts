import {Request} from "express";
import * as admin from "firebase-admin";
import {Device} from "@src/handlers/device/types";

export interface RequestWithUser extends Request {
    user?: admin.auth.UserRecord;
}

export type RequestWithDevice<T> = T & {
    device?: Device;
}
