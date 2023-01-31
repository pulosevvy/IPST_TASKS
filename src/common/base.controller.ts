import { Router, Response } from "express";
import {IControllerRoute } from "./route.interface";
import {injectable} from "inversify";
import 'reflect-metadata'
export { Router } from 'express';


@injectable()
export abstract class BaseController {
    private readonly _router: Router;

    constructor() {
        this._router = Router();
    }

    get router() {
        return this._router;
    }

    public send<T>(res: Response, code: number, message: T) {
        res.type('application/json');
        return res.status(code).json(message);
    }

    public ok<T>(res: Response, message: T) {
        return this.send<T>(res, 200, message);
    }

    public created(res: Response) {
        res.sendStatus(201);
    }

    protected bindRoutes(routes: IControllerRoute[]) {
        for (const route of routes) {
            console.log(`[${route.method}] ${route.path}`);
            const middleware = route.middlewares?.map(m => m.execute.bind(m));
            const handler = route.func.bind(this);
            const pipeLine = middleware ? [...middleware, handler] : handler;
            this.router[route.method](route.path, pipeLine);
        }
    }

}