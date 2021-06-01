import "module-alias/register";
import * as express from "express";
import {ensureAuthenticatedFirebase, ensureDevice} from "@src/middlewares";
import {
    createDeviceHandler,
    findDeviceById,
    listDevicesHandler,
    updateDevice,
} from "./devices";

export const devices = express();
devices.use(ensureAuthenticatedFirebase);
devices.get("/", listDevicesHandler);
devices.post("/", createDeviceHandler);

devices.use("/:deviceId", ensureDevice);
devices.get("/:deviceId", findDeviceById);
devices.put("/:deviceId", updateDevice);

