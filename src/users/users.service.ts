import {IUserService} from "./users.service.interface";
import {User} from "./user.entity";
import {UserRegisterDto} from "./dto/user-register.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {inject, injectable} from "inversify";
import 'reflect-metadata';
import {IConfigService} from "../config/config.service.interface";
import {TYPES} from "../types";
import {IUsersRepository} from "./users.repository.interface";
import {UserModel} from "@prisma/client";

@injectable()
export class UserService implements IUserService {

    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository
    ) {}

    async createUser({ name, surname, middleName, email, username, password }: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(name, surname, middleName!, email, username!);
        const salt = this.configService.get('SALT');
        await newUser.setPassword(password, Number(salt));
        const userIsExists = await this.usersRepository.find(email, username);
        if(userIsExists) {
            return null;
        }
        return this.usersRepository.create(newUser);
    }

    async validateUser({email, password}: UserLoginDto): Promise<boolean> {
        const userIsExists = await this.usersRepository.find(email);
        if (!userIsExists) {
            return false;
        }
        const newUser = new User(userIsExists.name, userIsExists.surname, userIsExists.middleName, userIsExists.email, userIsExists.username, userIsExists.password)
        return newUser.comparePassword(password);
    }

    async getUserInfo(email: string): Promise<UserModel | null> {
        return this.usersRepository.find(email);
    }
}