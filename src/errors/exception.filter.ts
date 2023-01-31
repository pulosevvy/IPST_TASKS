import { NextFunction, Request, Response } from "express";
import { IExceptionFilter } from "./exception.filter.interface";
import { HTTPError } from "./http-error.class";
import {injectable} from "inversify";
import 'reflect-metadata'

@injectable()
export class ExceptionFilter implements IExceptionFilter {

    constructor() {}

    catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
        if (err instanceof HTTPError) {
            console.log(`[${err.context}] Ошибка: ${err.statusCode} ${err.message}`);
            res.status(err.statusCode).send({err: err.message});
        } else {
            console.log(`${err.message}`);
            res.status(500).send({err: err.message});
        }

    }
}