import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/user-login.dto";
import { User } from "../users/users.model";
import { AuthRegisterResponse } from "./response/auth-register.response";
import { AuthLoginResponse } from "./response/auth-login.response";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: "Регистрация" })
    @ApiResponse({status: 201, type: AuthRegisterResponse})
    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        return this.authService.register(dto);
    }

    @ApiOperation({ summary: "Вход" })
    @ApiResponse({status: 200, type: AuthLoginResponse})
    @Post('login')
    async login(@Body() dto: LoginUserDto) {
        return this.authService.login(dto);
    }

}
