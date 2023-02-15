import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from "bcryptjs";

import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./users.model";
import { ALREADY_USER_ERROR } from "./users.constants";

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private userModel: typeof User,
    ) {}

    async createUser(dto: CreateUserDto) {
        const check = await this.findUserByLogin(dto.login);
        if(check) {
            throw new BadRequestException(ALREADY_USER_ERROR);
        }
        const hash = await bcrypt.hash(dto.password, 7);
        return await this.userModel.create({ ...dto, password: hash });
    }

    async findUserByLogin(login: string) {
        return await this.userModel.findOne({where: {login}})
    }

}
