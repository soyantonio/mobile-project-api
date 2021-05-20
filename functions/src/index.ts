import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import {car} from "./car";
import {user} from "./user";

const app = express();
const v0 = express();

// // Automatically allow cross-origin requests
app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//
// // Add middleware to authenticate requests
// app.use(myMiddleware);
//
// // build multiple CRUD interfaces:
// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
// app.put('/:id',
// (req, res) => res.send(Widgets.update(req.params.id, req.body)));
// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));
// app.get('/', (req, res) => res.send(Widgets.list()));


v0.use("/car", car);
v0.use("/user", user);
app.use("/v0", v0);
export const api = functions.https.onRequest(app);
