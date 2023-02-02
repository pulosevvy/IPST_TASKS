import { BaseController } from "../common/base.controller";
import { NextFunction, Request, Response } from "express";
import { HTTPError } from "../errors/http-error.class";
import {inject, injectable} from "inversify";
import 'reflect-metadata'
import {IUserController} from "./users.controller.interface";
import {UserLoginDto} from "./dto/user-login.dto";
import {UserRegisterDto} from "./dto/user-register.dto";
import {TYPES} from "../types";
import {ValidateMiddleware} from "../common/validate.middleware";
import {IUserService} from "./users.service.interface";
import { sign } from 'jsonwebtoken';
import {IConfigService} from "../config/config.service.interface";
import {AuthMiddleware} from "../common/auth.middleware";

@injectable()
export class UserController extends BaseController implements IUserController{

    constructor(
            @inject(TYPES.UserService) private userService: IUserService,
            @inject(TYPES.ConfigService) private configService: IConfigService
    ) {
        super();
        this.bindRoutes([
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new ValidateMiddleware(UserRegisterDto)]
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new ValidateMiddleware(UserLoginDto)]
            },
            {
                path: '/info',
                method: 'get',
                func: this.info,
                middlewares: [new AuthMiddleware(this.configService.get('SECRET'))]
            }
        ])
    }

    async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.validateUser(req.body);

        if (!result) {
            return next(new HTTPError(401, 'Ошибка авторизации', 'login'));
        }
        const token = await this.signJWT(req.body.email, this.configService.get('SECRET'))
        this.ok(res, {token: token});
    }

    async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.createUser(body);
        if (!result) {
            return next(new HTTPError(422, 'Такой пользователь уже существует', 'register'));
        }
        this.ok(res, { email: result.email, id: result.id });
    }

    async info(req: Request, res: Response, next: NextFunction): Promise<void> {
        this.ok(res, {message: 'access is allowed'});
    }

    private signJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    email,
                    iat: Math.floor(Date.now() / 1000),
                },
                secret,
                {
                    algorithm: 'HS256',
                    expiresIn: '5min',
                },
                (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(token as string);
                },
            );
        });
    }

}