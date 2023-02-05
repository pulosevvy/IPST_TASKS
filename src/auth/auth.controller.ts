import {inject, injectable} from "inversify";
import {BaseController} from "../common/base.controller";
import {ValidateMiddleware} from "../common/validate.middleware";
import {LoginDto} from "./dto/login.dto";
import {UserCreateDto} from "../users/dto/user-create.dto";
import {AuthService} from "./auth.service";
import {TYPES} from "../types";
import {NextFunction, Request, Response} from "express";
import {HTTPError} from "../errors/http-error.class";
import {IUserService} from "../users/users.service.interface";
import {JwtService} from "./jwt.service";
import {IConfigService} from "../config/config.service.interface";
import {IAuthController} from "./auth.controller.interface";

@injectable()
export class AuthController extends BaseController implements IAuthController{

    constructor(
        @inject(TYPES.AuthService) private authService: AuthService,
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.JwtService) private jwtService: JwtService
    ) {
        super();
        this.bindRoutes([
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new ValidateMiddleware( UserCreateDto)]
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new ValidateMiddleware(LoginDto)]
            },
            {
                path: '/refresh',
                method: 'get',
                func: this.refreshToken,
                middlewares: []
            }
        ])
    }

    async register(req: Request<{}, {}, UserCreateDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.createUser(req.body);

        if (!result) {
            return next(new HTTPError(422, 'Такой пользователь уже существует', 'register'))
        }

        this.ok(res, {id: result.id, email: result.email});
    }

    async login(req: Request<{}, {}, LoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.authService.login(req.body);

        if (!result) {
            return next(new HTTPError(401, 'Такого пользователя не существует', 'login'));
        }

        const tokens = this.jwtService.signJWTokens(result.id, result.email, result.is_confirmed, this.configService.get('SECRET'));
        await this.jwtService.saveRefreshToken(result.id, tokens.refreshToken)
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true });

        this.ok(res, {id: result.id, email: result.email, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken});
    }


    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const refreshToken = req.cookies['refreshToken'];

        if(!refreshToken) {
            next(new HTTPError(401, 'Авторизируйтесь', 'refresh'))
        }
        const result = await this.jwtService.refreshToken(refreshToken);

        if (!result) {
            next(new HTTPError(401, 'Ошибка', 'refresh'))
        }

        res.cookie('refreshToken', result?.tokens.refreshToken, { maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true });

        this.ok(res, {id: result?.user.id, email: result?.user.email, accessToken: result?.tokens.accessToken, refreshToken: result?.tokens.refreshToken })
    }


}