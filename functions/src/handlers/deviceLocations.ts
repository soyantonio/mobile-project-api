import "module-alias/register";
import {v4 as uuidv4} from "uuid";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd";
import {DeviceLocation} from "@src/handlers/deviceLocations.type";
import {
    Device,
    HandlerWithDevice,
} from "@src/handlers/device/types";
import {deviceLocationsRef} from "@src/datastore";

const ajv = new Ajv();
const DEFAULT_ID = "";

const deviceLocationSchema: JTDSchemaType<DeviceLocation> = {
    properties: {
        latitude: {type: "float64"},
        longitude: {type: "float64"},
    },
    optionalProperties: {
        _id: {type: "string"},
        _deviceId: {type: "string"},
        _createdAt: {type: "string"},
    },
};

export const createDeviceLocationsHandler:HandlerWithDevice = async (
    req, res) => {
    const device = req.device as Device;

    const validateDeviceLocation = ajv.compile(deviceLocationSchema);
    if (!validateDeviceLocation(req.body)) {
        res.status(400).send(validateDeviceLocation.errors).end();
        return;
    }
    const payload: DeviceLocation = req.body as DeviceLocation;
    const deviceLocation: DeviceLocation = {
        ...payload,
        _id: uuidv4(),
        _deviceId: device._id,
        _createdAt: new Date().toISOString(),
    };
    try {
        await deviceLocationsRef
            .doc(deviceLocation._id ?? DEFAULT_ID).set(deviceLocation);
        res.send(deviceLocation);
    } catch {
        res.status(500).send({
            message: "Could not create device location",
        });
    }
};

const listRecords = async (deviceId?: string): Promise<DeviceLocation[]> => {
    if (!deviceId) return [];
    try {
        const snapshot = await deviceLocationsRef
            .where("_deviceId", "==", deviceId).get();
        return snapshot.docs.map((doc) => doc.data() as DeviceLocation);
    } catch {
        return [];
    }
};

const sortDesc= (records: DeviceLocation[]): DeviceLocation[] =>
    records.sort((a, b) => {
        const dateA = Date.parse(a._createdAt ?? "");
        const dateB = Date.parse(b._createdAt ?? "");
        return dateB - dateA;
    });

export const listDeviceLocationsHandler:HandlerWithDevice = async (
    req, res) => {
    const device = req.device as Device;
    res.send(sortDesc(await listRecords(device._id)));
};

export const lastDeviceLocationHandler:HandlerWithDevice = async (
    req, res) => {
    const device = req.device as Device;
    const records = await listRecords(device._id);
    if (records.length == 0) {
        res.status(404).send({
            message: "Could not found any device location",
        });
        return;
    }

    const sortedRecordsDesc = sortDesc(records);
    res.send(sortedRecordsDesc[0]);
};
