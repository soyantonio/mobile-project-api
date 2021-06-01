import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";

import "./config";
import {devices} from "./handlers/device";
import {user} from "./handlers/user";

const app = express();
const v0 = express();

// // Automatically allow cross-origin requests
app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// // build multiple CRUD interfaces:
// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));

v0.use("/devices", devices);
v0.use("/users", user);
app.use("/v0", v0);
export const api = functions.https.onRequest(app);
