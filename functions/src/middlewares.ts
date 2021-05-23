import * as jwt from "jwt-simple";
import * as dayjs from "dayjs";
import * as admin from "firebase-admin";
import {Request, Response, NextFunction} from "express";
import {TOKEN_SECRET} from "./config";

const auth = admin.auth();

export interface RequestWithUser extends Request {
    user?: admin.auth.DecodedIdToken;
}

export const ensureAuthenticatedFirebase = async (
    req: RequestWithUser, res: Response, next: NextFunction
): Promise<void> => {
    if (!req.headers.authorization) {
        res.status(403).send({
            message: "Authorization header not found",
        });
        return;
    }
    const token = req.headers.authorization.split(" ")[1];

    try {
        req.user = await auth.verifyIdToken(token);
        next();
    } catch (e) {
        res.status(401).send({
            message: "The token has expired",
        });
        return;
    }
};

export const ensureAuthenticated = (
    req: RequestWithUser, res: Response, next: NextFunction
): void => {
    if (!req.headers.authorization) {
        res.status(403).send({
            message: "Authorization header not found",
        });
        return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.decode(token, TOKEN_SECRET);

    if (payload.exp <= dayjs().unix()) {
        res.status(401).send({
            message: "The token has expired",
        });
        return;
    }

    req.user = payload.sub;
    next();
};
