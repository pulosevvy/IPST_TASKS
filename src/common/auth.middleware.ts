import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { verify} from 'jsonwebtoken';
import {HTTPError} from "../errors/http-error.class";
import {inject} from "inversify";
import {TYPES} from "../types";
import {UsersRepository} from "../users/users.repository";

export class AuthMiddleware implements IMiddleware {

	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {

		if (req.headers.authorization) {
			const accessToken = req.headers.authorization.split(' ')[1];
			// const verification = verify(accessToken, this.secret) as IDataStoredToken;

			//нужно явно побольше поработать с TS. Payload с типом any такое себе, но так работает и правильно присваивает
			verify(accessToken, this.secret, (err, payload: any) => {
				if (err) {
					return next(new HTTPError(401, 'Ошибка доступа', 'login'));
				} else if(payload) {
					req.user = payload.email;
					next();
				}
			});
		} else {
			return next(new HTTPError(401, 'Необходима авторизация', 'login'));
		}
	}
}