import {Request} from "express";
import {Device} from "@src/handlers/device/types";
import {UserRecord} from "@src/handlers/user.type";

export interface RequestWithUser extends Request {
    user?: UserRecord;
}

export type RequestWithDevice<T> = T & {
    device?: Device;
}
