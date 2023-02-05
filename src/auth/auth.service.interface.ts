import {UserModel} from "@prisma/client";
import {NextFunction, Request, Response} from "express";

export interface IAuthService {
    login: (req: Request, res: Response, next: NextFunction) => Promise<UserModel | false>;
}