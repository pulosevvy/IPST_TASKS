import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import {HTTPError} from "../errors/http-error.class";

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {

		if (req.headers.authorization) {
			const accessToken = req.headers.authorization.split(' ')[1];
			verify(accessToken, this.secret, (err, payload) => {
				if (err) {
					return next(new HTTPError(401, 'Ошибка доступа', 'login'));
				}
				req.user = payload as string;
				next();
			});
		} else {
			return next(new HTTPError(401, 'Необходима авторизация', 'login'));
		}
	}
}