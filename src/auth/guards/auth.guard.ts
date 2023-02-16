import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

import { USER_NOT_AUTH_ERROR } from "../auth.constants";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        try {
            const token = request.headers.authorization.split(' ')[1];
            if (!token) {
                throw new UnauthorizedException(USER_NOT_AUTH_ERROR);
            }
            const user = this.jwtService.verify(token);
            request.user = user;
            return true;
        } catch(e) {
            throw new UnauthorizedException(USER_NOT_AUTH_ERROR);
        }

    }

}
