import "module-alias/register";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd";
import {
    DeviceCommand,
    DeviceCommandPayloadType,
} from "@src/handlers/deviceCommands.type";
import {Device, HandlerWithDevice} from "@src/handlers/device/types";
import {v4 as uuidv4} from "uuid";
import {deviceCommandsRef} from "@src/datastore";

const ajv = new Ajv();
const DEFAULT_ID = "";

const deviceCommandSchema: JTDSchemaType<DeviceCommand> = {
    properties: {
        payload: {type: "string"},
        payloadType: {enum: [
            DeviceCommandPayloadType.UserDefined,
            DeviceCommandPayloadType.Joystick,
        ]},
    },
    optionalProperties: {
        _id: {type: "string"},
        _deviceId: {type: "string"},
        _createdAt: {type: "string"},
        _isFirstRead: {type: "boolean"},
    },
};


export const createDeviceCommandHandler:HandlerWithDevice = async (
    req, res) => {
    const device = req.device as Device;

    const validateDeviceCommand = ajv.compile(deviceCommandSchema);
    if (!validateDeviceCommand(req.body)) {
        res.status(400).send(validateDeviceCommand.errors).end();
        return;
    }
    const payload: DeviceCommand = req.body as DeviceCommand;
    const deviceCommand: DeviceCommand = {
        ...payload,
        _isFirstRead: true,
        _id: uuidv4(),
        _deviceId: device._id,
        _createdAt: new Date().toISOString(),
    };
    try {
        await deviceCommandsRef
            .doc(deviceCommand._id ?? DEFAULT_ID).set(deviceCommand);
        res.send(deviceCommand);
    } catch {
        res.status(500).send({
            message: "Could not create device command",
        });
    }
};

const listRecords = async (deviceId?: string): Promise<DeviceCommand[]> => {
    if (!deviceId) return [];
    try {
        const snapshot = await deviceCommandsRef
            .where("_deviceId", "==", deviceId).get();
        return snapshot.docs.map((doc) => doc.data() as DeviceCommand);
    } catch {
        return [];
    }
};

const sortDesc= (records: DeviceCommand[]): DeviceCommand[] =>
    records.sort((a, b) => {
        const dateA = Date.parse(a._createdAt ?? "");
        const dateB = Date.parse(b._createdAt ?? "");
        return dateB - dateA;
    });

export const listDeviceCommandsHandler:HandlerWithDevice = async (
    req, res) => {
    const device = req.device as Device;
    res.send(sortDesc(await listRecords(device._id)));
};

export const lastDeviceCommandHandler:HandlerWithDevice = async (
    req, res) => {
    const device = req.device as Device;
    const records = await listRecords(device._id);
    if (records.length == 0) {
        res.status(404).send({
            message: "Could not found any device command",
        });
        return;
    }

    const sortedRecordsDesc = sortDesc(records);
    res.send(sortedRecordsDesc[0]);
};
