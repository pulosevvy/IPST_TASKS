import {IUserService} from "./users.service.interface";
import {User} from "./user.entity";
import {UserCreateDto} from "./dto/user-create.dto";
import {inject, injectable} from "inversify";
import 'reflect-metadata';
import {IConfigService} from "../config/config.service.interface";
import {TYPES} from "../types";
import {IUsersRepository} from "./users.repository.interface";
import {UserModel} from "@prisma/client";
import { v4 } from 'uuid'
import {MailService} from "../mail/mail.service";
import {sign} from "jsonwebtoken";

@injectable()
export class UserService {

    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
        @inject(TYPES.MailService) private mailService: MailService
    ) {}

    async createUser({ name, surname, middleName, email, username, password }: UserCreateDto): Promise<UserModel | null > {
        const newUser = new User(name, surname, middleName!, email, username!);
        const salt = this.configService.get('SALT');
        await newUser.setPassword(password, Number(salt));
        const userIsExists = await this.usersRepository.find(email, username);
        if(userIsExists) {
            return null;
        }
        const saveUser = await this.usersRepository.create(newUser);
        if(!saveUser) {
            return null;
        }
        const dateForLink = {
            "email": saveUser.email
        }
        const linkForActivate = sign(dateForLink, this.configService.get('SECRET_FOR_MAIL'), {expiresIn: '1d'});

        await this.sendMailForActivate(saveUser.email, linkForActivate);

        return saveUser;
    }

    async findUsersByEmail(email: string) {
        return this.usersRepository.find(email);
    }

    async updateConfirm(userId: number) {
        return this.usersRepository.updateConfirm(userId);
    }

    async sendMailForActivate(email: string, linkForActivate: string) {
        return this.mailService.sendMail(email, `${this.configService.get('SITE')}/users/activate?link=${linkForActivate}`)
    }

    async getUserInfo(email: string): Promise<UserModel | null> {
        return this.usersRepository.find(email);
    }

}