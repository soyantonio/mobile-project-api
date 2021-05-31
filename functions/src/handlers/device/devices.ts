import "module-alias/register";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd";
import {v4 as uuidv4} from "uuid";
import {devicesRef} from "@src/datastore";
import {Device, DeviceVariant, HandlerWithUser} from "./types";

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
        await devicesRef.add(device);
        res.send(device);
    } catch {
        res.status(401).send({
            message: "Could not create devie",
        });
    }
};

export const findDeviceById:HandlerWithUser = async (req, res) => {
    const user = req.user;
    if (user == undefined) {
        res.sendStatus(403);
        return;
    }

    console.log(user);
    res.send("Hello World");
};
