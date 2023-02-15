import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { LoginUserDto } from "./dto/user-login.dto";
import { User } from "../users/users.model";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {}

    @ApiOperation({ summary: "Регистрация" })
    @ApiResponse({status: 201, type: User, description: 'Возвращает token'})
    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        return this.authService.register(dto);
    }

    @ApiOperation({ summary: "Вход" })
    @ApiResponse({status: 200, type: User, description: 'Возвращает token'})
    @Post('login')
    async login(@Body() dto: LoginUserDto) {
        return this.authService.login(dto);
    }

}
