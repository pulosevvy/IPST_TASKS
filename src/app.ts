import express, { Express } from 'express';
import {  Server  } from 'http';
import { UserController } from "./users/users.controller";
import { ExceptionFilter } from "./errors/exception.filter";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import 'reflect-metadata'
import { json } from "body-parser";

@injectable()
export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
    ) {
        this.app = express();
        this.port = 8000;
    }

    useMiddleware(): void {
        this.app.use(json())
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
    }

    useExceptionFilters(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port);
        console.log(`Server starting on http://localhost:${this.port}`)
    }
}