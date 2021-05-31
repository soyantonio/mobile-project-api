import "module-alias/register";
import {Response} from "express";
import {RequestWithUser} from "@src/middleware.types";

export type HandlerWithUser = (
    req: RequestWithUser, res: Response) => Promise<void>;

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
