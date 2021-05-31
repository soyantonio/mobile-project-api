import "module-alias/register";
import {Response} from "express";
import {RequestWithUser} from "@src/middlewares";

export type HandlerWithUser = (
    req: RequestWithUser, res: Response) => Promise<void>;
