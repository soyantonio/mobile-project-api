import "module-alias/register";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd";
import {v4 as uuidv4} from "uuid";
import {devicesRef} from "@src/datastore";
import {
    Device,
    DeviceVariant,
    HandlerWithUser,
    HandlerWithDevice,
} from "./types";

const deviceSchema: JTDSchemaType<Device> = {
    properties: {
        bluetoothAddress: {type: "string"},
        name: {type: "string"},
        variant: {enum: [DeviceVariant.Console, DeviceVariant.Car]},
    },
    optionalProperties: {
        _id: {type: "string"},
        _createdBy: {type: "string"},
    },
};

const DEFAULT_DEVICE_ID = "";
const ajv = new Ajv();
export const createDeviceHandler:HandlerWithUser = async (req, res) => {
    const user = req.user;
    if (user == undefined) {
        res.sendStatus(403);
        return;
    }
    const validateDevice = ajv.compile(deviceSchema);
    if (!validateDevice(req.body)) {
        res.status(400).send(validateDevice.errors).end();
        return;
    }
    const payload: Device = req.body as Device;
    const device: Device = {
        ...payload,
        _createdBy: user.uid,
        _id: uuidv4(),
    };
    try {
        await devicesRef.doc(device._id ?? DEFAULT_DEVICE_ID).set(device);
        res.send(device);
    } catch {
        res.status(401).send({
            message: "Could not create devie",
        });
    }
};

export const listDevicesHandler:HandlerWithUser = async (req, res) => {
    const user = req.user;
    if (user == undefined) {
        res.sendStatus(403);
        return;
    }
    try {
        const devicesSnapshot = await devicesRef
            .where("_createdBy", "==", user.uid).get();
        res.send(devicesSnapshot.docs.map((doc) => doc.data()));
    } catch {
        res.status(401).send({
            message: "Could fetch devices",
        });
    }
};

export const findDeviceById:HandlerWithDevice = async (req, res) => {
    const user = req.user;
    const device = req.device as Device;
    if (user == undefined) {
        res.sendStatus(403);
        return;
    }
    res.send(device);
};

export const updateDevice:HandlerWithDevice = async (req, res) => {
    const device = req.device as Device;
    const validateDevice = ajv.compile(deviceSchema);

    if (!validateDevice(req.body)) {
        res.status(400).send(validateDevice.errors).end();
        return;
    }

    const payload: Device = req.body as Device;
    const deviceUpdated: Device = {
        ...payload,
        _createdBy: device._createdBy,
        _id: device._id,
    };
    try {
        await devicesRef.doc(device._id ?? DEFAULT_DEVICE_ID)
            .update(deviceUpdated);
        res.send(deviceUpdated);
    } catch {
        res.status(401).send({
            message: "Could not update devie",
        });
    }
};
