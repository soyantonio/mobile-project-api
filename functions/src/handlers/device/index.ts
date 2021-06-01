import "module-alias/register";
import * as express from "express";
import {ensureAuthenticatedFirebase, ensureDevice} from "@src/middlewares";
import {
    createDeviceLocationsHandler,
    lastDeviceLocationHandler,
    listDeviceLocationsHandler,
} from "@src/handlers/deviceLocations";
import {
    createDeviceCommandHandler,
    lastDeviceCommandHandler,
    listDeviceCommandsHandler,
} from "@src/handlers/deviceCommands";
import {
    createDeviceStatusHandler,
    lastDeviceStatusHandler,
    listDeviceStatusHandler,
} from "@src/handlers/deviceStatus";

import {
    createDeviceHandler,
    deleteDevice,
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
devices.delete("/:deviceId", deleteDevice);

devices.post("/:deviceId/locations", createDeviceLocationsHandler);
devices.get("/:deviceId/locations", listDeviceLocationsHandler);
devices.get("/:deviceId/locations/last", lastDeviceLocationHandler);

devices.post("/:deviceId/commands", createDeviceCommandHandler);
devices.get("/:deviceId/commands", listDeviceCommandsHandler);
devices.get("/:deviceId/commands/pop", lastDeviceCommandHandler);

devices.post("/:deviceId/status", createDeviceStatusHandler);
devices.get("/:deviceId/status", listDeviceStatusHandler);
devices.get("/:deviceId/status/last", lastDeviceStatusHandler);
