import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as admin from "firebase-admin";
import firebase from "firebase/app";
import {FIREBASE_CONFIG} from "./config";
import {car} from "./handlers/car";
import {user} from "./handlers/user";

admin.initializeApp();
firebase.initializeApp(FIREBASE_CONFIG);

const app = express();
const v0 = express();

// // Automatically allow cross-origin requests
app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// // build multiple CRUD interfaces:
// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));

v0.use("/car", car);
v0.use("/user", user);
app.use("/v0", v0);
export const api = functions.https.onRequest(app);
