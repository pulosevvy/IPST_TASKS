import { BadRequestException, Injectable } from "@nestjs/common";
import { compare } from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";

import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.model";
import { ALREADY_USER_ERROR, USER_NOT_EXISTS } from "../users/users.constants";
import { LoginUserDto } from "./dto/user-login.dto";
import { INVALID_PASSWORD_ERROR } from "./auth.constants";
import { FoldersService } from "../folders/folders.service";

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private folderService: FoldersService
    ) {}

    async register(dto: CreateUserDto) {
        const checkUser = await this.checkUser(dto.login);
        if(checkUser) {
            throw new BadRequestException(ALREADY_USER_ERROR);
        }
        const newUser = await this.userService.createUser(dto);
        await this.folderService.createRootFolder(newUser.id);
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
        const user = await this.checkUser(dto.login);
        if(!user) {
            throw new BadRequestException(USER_NOT_EXISTS);
        }
        const comparePassword = await compare(dto.password, user.password)
        if(!comparePassword) {
            throw new BadRequestException(INVALID_PASSWORD_ERROR);
        }
        return user;
    }

    private async generateToken(user: User) {
        const payload = {id: user.id, login: user.login}
        return this.jwtService.sign(payload);
    }

    private async checkUser(login: string) {
        return await this.userService.findUserByLogin(login);
    }

}
