import "module-alias/register";
import * as express from "express";
import {ensureAuthenticatedFirebase} from "@src/middlewares";
import {
    createDeviceHandler,
    findDeviceById,
    listDevicesHandler,
} from "./devices";


const singleDevice = express();
singleDevice.get("/", findDeviceById);


export const devices = express();
devices.use(ensureAuthenticatedFirebase);
devices.get("/", listDevicesHandler);
devices.post("/", createDeviceHandler);
devices.use("/:deviceId", singleDevice);

