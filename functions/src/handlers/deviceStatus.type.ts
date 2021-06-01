export enum DeviceStatusEnum {
    Online = "online",
    Offline = "offline",
}

export interface DeviceStatus {
    _id?: string;
    _createdAt?: string;
    _deviceId?: string;
    status: DeviceStatusEnum;
}
