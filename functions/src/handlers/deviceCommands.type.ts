export enum DeviceCommandPayloadType {
    UserDefined = "userDefined",
    Joystick = "joystick",
}

export interface DeviceCommand {
    _id?: string;
    _createdAt?: string;
    _deviceId?: string;
    _isFirstRead?: boolean;
    payload: string;
    payloadType: DeviceCommandPayloadType;
}
