import { BaseController } from "../common/base.controller";
import { NextFunction, Request, Response } from "express";
import {inject, injectable} from "inversify";
import 'reflect-metadata'
import {IUserController} from "./users.controller.interface";
import {TYPES} from "../types";
import {IUserService} from "./users.service.interface";
import {IConfigService} from "../config/config.service.interface";
import {AuthMiddleware} from "../common/auth.middleware";
import {AuthService} from "../auth/auth.service";


@injectable()
export class UserController extends BaseController implements IUserController{

    constructor(
            @inject(TYPES.UserService) private userService: IUserService,
            @inject(TYPES.ConfigService) private configService: IConfigService,
            @inject(TYPES.AuthService) private authService: AuthService

    ) {
        super();
        this.bindRoutes([
            {
                path: '/info',
                method: 'get',
                func: this.info,
                middlewares: [new AuthMiddleware(this.configService.get('SECRET'))]
            }
        ])
    }

    async info(req: Request, res: Response, next: NextFunction): Promise<void> {
        const getUser = await this.userService.getUserInfo(req.user);
        this.ok(res, {id: getUser?.id, email: getUser?.email, is_confirmed: getUser?.is_confirmed});
    }


    // private signJWT(email: string, secret: string) {
    //     const accessToken = sign({email}, secret, {algorithm: "HS256", expiresIn: '5min'});
    //     const refreshToken = sign({email}, secret, {algorithm: "HS256", expiresIn: '15d'})
    //
    //     return {accessToken, refreshToken}
    // }
        // return new Promise<string>((resolve, reject) => {
        //     sign(
        //         {
        //             email: email,
        //             iat: Math.floor(Date.now() / 1000),
        //         },
        //         secret,
        //         {
        //             algorithm: 'HS256',
        //             expiresIn: '5min',
        //         },
        //         (err, token) => {
        //             if (err) {
        //                 reject(err);
        //             }
        //             resolve(token as string);
        //         },
        //     );
        // });
    //}

}