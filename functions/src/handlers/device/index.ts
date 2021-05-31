import "module-alias/register";
import * as express from "express";
import {ensureAuthenticatedFirebase} from "@src/middlewares";
import {createDeviceHandler, findDeviceById} from "./devices";


const singleDevice = express();
singleDevice.get("/", findDeviceById);


export const devices = express();
devices.use(ensureAuthenticatedFirebase);
devices.post("/", createDeviceHandler);
devices.use("/:deviceId", singleDevice);

