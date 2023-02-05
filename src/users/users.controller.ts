import { BaseController } from "../common/base.controller";
import { NextFunction, Request, Response } from "express";
import {inject, injectable, interfaces} from "inversify";
import 'reflect-metadata'
import {IUserController} from "./users.controller.interface";
import {TYPES} from "../types";
import {IUserService} from "./users.service.interface";
import {IConfigService} from "../config/config.service.interface";
import {AuthMiddleware} from "../common/auth.middleware";
import {AuthService} from "../auth/auth.service";
import Next = interfaces.Next;
import {verify} from "jsonwebtoken";
import {UserService} from "./users.service";
import {UsersRepository} from "./users.repository";
import {HTTPError} from "../errors/http-error.class";


@injectable()
export class UserController extends BaseController implements IUserController{

    constructor(
            @inject(TYPES.UserService) private userService: UserService,
            @inject(TYPES.ConfigService) private configService: IConfigService,
            @inject(TYPES.AuthService) private authService: AuthService,
            @inject(TYPES.UsersRepository) private userRepository: UsersRepository

    ) {
        super();
        this.bindRoutes([
            {
                path: '/info',
                method: 'get',
                func: this.info,
                middlewares: [new AuthMiddleware(this.configService.get('SECRET'))]
            },
            {
                path: '/activate',
                method: 'get',
                func: this.activate,
                middlewares: []
            }
        ])
    }

    async info(req: Request, res: Response, next: NextFunction): Promise<void> {
        const getUser = await this.userService.getUserInfo(req.user);
        this.ok(res, {id: getUser?.id, email: getUser?.email, is_confirmed: getUser?.is_confirmed});
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        const token = req.query.link;
        if(token) {
            try {
                verify(token as string, this.configService.get('SECRET_FOR_MAIL'), async (e, decoded: any) => {
                    if (e) {
                        console.log(e)
                        return next(new HTTPError(403, 'Error', 'activation'))
                    } else {
                        req.email = decoded.email;
                    }
                });
            } catch (err) {
                console.log(err)
                return next(new HTTPError(403, 'Error', 'activation'))
            }
        } else {
            return next(new HTTPError(403, 'Error', 'activation'))
        }

        const user = await this.userService.findUsersByEmail(req.email)
        if(!user) {
            return next(new HTTPError(422, 'Пользователь не найден', 'activation'))
        }

        const userConfirm = await this.userService.updateConfirm(user.id);

        if(!userConfirm) {
            return next(new HTTPError(422, 'Ошибка подтверждения', 'activation'))
        }
        // user.is_confirmed = true
        this.ok(res, {message: 'Почта подтверждена'});
    }

}
