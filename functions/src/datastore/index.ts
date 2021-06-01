import * as admin from "firebase-admin";

const db = admin.firestore();
db.settings({
    timestampsInSnapshots: true,
});

export const devicesRef = db.collection("devices");
export const deviceLocationsRef = db.collection("deviceLocations");
export const deviceCommandsRef = db.collection("deviceCommands");
export const deviceStatusRef = db.collection("deviceStatus");
