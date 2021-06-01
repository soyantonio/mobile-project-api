import "module-alias/register";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd";
import {DeviceStatus, DeviceStatusEnum} from "@src/handlers/deviceStatus.type";
import {Device, HandlerWithDevice} from "@src/handlers/device/types";
import {v4 as uuidv4} from "uuid";
import {deviceStatusRef} from "@src/datastore";

const ajv = new Ajv();
const DEFAULT_ID = "";

const deviceStatusSchema: JTDSchemaType<DeviceStatus> = {
    properties: {
        status: {
            enum: [
                DeviceStatusEnum.Online,
                DeviceStatusEnum.Offline,
            ]},
    },
    optionalProperties: {
        _id: {type: "string"},
        _deviceId: {type: "string"},
        _createdAt: {type: "string"},
    },
};

export const createDeviceStatusHandler:HandlerWithDevice = async (
    req, res) => {
    const device = req.device as Device;

    const validateDeviceStatus = ajv.compile(deviceStatusSchema);
    if (!validateDeviceStatus(req.body)) {
        res.status(400).send(validateDeviceStatus.errors).end();
        return;
    }
    const payload: DeviceStatus = req.body as DeviceStatus;
    const deviceStatus: DeviceStatus = {
        ...payload,
        _id: uuidv4(),
        _deviceId: device._id,
        _createdAt: new Date().toISOString(),
    };
    try {
        await deviceStatusRef
            .doc(deviceStatus._id ?? DEFAULT_ID).set(deviceStatus);
        res.send(deviceStatus);
    } catch {
        res.status(500).send({
            message: "Could not create device status",
        });
    }
};

const listRecords = async (deviceId?: string): Promise<DeviceStatus[]> => {
    if (!deviceId) return [];
    try {
        const snapshot = await deviceStatusRef
            .where("_deviceId", "==", deviceId).get();
        return snapshot.docs.map((doc) => doc.data() as DeviceStatus);
    } catch {
        return [];
    }
};

export const listDeviceStatusHandler:HandlerWithDevice = async (
    req, res) => {
    const device = req.device as Device;
    res.send(await listRecords(device._id));
};

export const lastDeviceStatusHandler:HandlerWithDevice = async (
    req, res) => {
    const device = req.device as Device;
    const records = await listRecords(device._id);
    if (records.length == 0) {
        res.status(404).send({
            message: "Could not found any device status",
        });
        return;
    }

    const sortedRecordsDesc = records.sort((a, b) => {
        const dateA = Date.parse(a._createdAt ?? "");
        const dateB = Date.parse(b._createdAt ?? "");
        return dateB - dateA;
    });

    res.send(sortedRecordsDesc[0]);
};
