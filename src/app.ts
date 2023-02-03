import express, { Express } from 'express';
import {  Server  } from 'http';
import { UserController } from "./users/users.controller";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import 'reflect-metadata'
import { json } from "body-parser";
import {IConfigService} from "./config/config.service.interface";
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {PrismaService} from "./database/prisma.service";
import cookieParser from "cookie-parser";
import cors from 'cors';
import {AuthController} from "./auth/auth.controller";

@injectable()
export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
        @inject(TYPES.AuthController) private authController: AuthController
    ) {
        this.app = express();
        this.port = 8000;
    }

    useMiddleware(): void {
        this.app.use(json());
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
        this.app.use('/auth', this.authController.router);
    }

    useExceptionFilters(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExceptionFilters();
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        console.log(`Server starting on http://localhost:${this.port}`)
    }
}