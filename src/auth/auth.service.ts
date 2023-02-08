import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { ALREADY_USER_ERROR, USER_NOT_EXISTS } from "../users/users.constants";
import { LoginUserDto } from "./dto/user-login.dto";
import { compare } from 'bcryptjs';
import { INVALID_PASSWORD_ERROR } from "./auth.constants";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/users.model";

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(dto: CreateUserDto) {
        const checkUser = await this.userService.findUserByLogin(dto.login);
        if(checkUser) {
            throw new BadRequestException(ALREADY_USER_ERROR);
        }
        const newUser = await this.userService.createUser(dto);
        const token = await this.generateToken(newUser);
        return {user: newUser.login, token: token}
    }

    async login(dto: LoginUserDto) {
        const user = await this.validateLoginUser(dto);
        const token = await this.generateToken(user);

        return {
            token
        }
    }

    async validateLoginUser(dto: LoginUserDto) {
        const user = await this.userService.findUserByLogin(dto.login);
        if(!user) {
            throw new BadRequestException(USER_NOT_EXISTS);
        }
        const comparePassword = await compare(dto.password, user.password)
        if(!comparePassword) {
            throw new BadRequestException(INVALID_PASSWORD_ERROR);
        }
        return user;
    }

    async generateToken(user: User) {
        const payload = {login: user.login}
        return this.jwtService.sign(payload);
    }




}
