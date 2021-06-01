import * as jwt from "jwt-simple";
import * as dayjs from "dayjs";
import {TOKEN_SECRET} from "./config";

export const createToken = (sub: string): string => {
    const payload = {
        sub: sub,
        iat: dayjs().unix(),
        exp: dayjs().add(14, "days").unix(),
    };
    return jwt.encode(payload, TOKEN_SECRET);
};
