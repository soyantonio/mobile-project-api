import * as admin from "firebase-admin";
export type UserRecord = admin.auth.UserRecord;

export interface ILogin {
    email: string
    password: string
}

export interface IRegister {
    email: string
    password: string
}
