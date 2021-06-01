import "module-alias/register";
import {Response} from "express";
import {RequestWithDevice, RequestWithUser} from "@src/middleware.types";

export type HandlerWith<T> = (
    req: T, res: Response) => Promise<void>;

export type HandlerWithUser = HandlerWith<RequestWithUser>
export type HandlerWithDevice = HandlerWith<RequestWithDevice<RequestWithUser>>

export enum DeviceVariant {
    Console = "console",
    Car = "car",
}

export interface Device {
    _id?: string;
    _createdBy?: string;
    name: string;
    bluetoothAddress: string;
    variant: DeviceVariant
}
