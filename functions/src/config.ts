import * as functions from "firebase-functions";
export const TOKEN_SECRET = process.env.TOKEN_SECRET || "tokenultrasecreto";

interface IFirebaseConf {
    projectId?: string;
    storageBucket?: string;
    databaseURL?: string;
}

interface IFirebaseEnv {
    apikey?: string;
    senderid?: string;
    appid?: string;
    measurementid?: string;
}

const CONFIG = JSON.parse(process.env.FIREBASE_CONFIG ?? "{}") as IFirebaseConf;
const FIREBASE_ENV = (functions.config().fenv ?? {}) as IFirebaseEnv;

const PROJECT_ID = CONFIG.projectId ?? "";
const DATABASE_URL = CONFIG.databaseURL ?? "";
const STORAGE_BUCKET = CONFIG.storageBucket ?? "";

const API_KEY = FIREBASE_ENV.apikey ?? "";
const SENDER_ID = FIREBASE_ENV.senderid ?? "";
const APP_ID = FIREBASE_ENV.appid ?? "";

export const FIREBASE_CONFIG = {
    apiKey: API_KEY,
    authDomain: `${PROJECT_ID}.firebaseapp.com`,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: SENDER_ID,
    appId: APP_ID,
};
