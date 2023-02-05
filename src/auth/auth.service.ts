import {User} from "../users/user.entity";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {LoginDto} from "./dto/login.dto";
import {UserModel} from "@prisma/client";
import {IUsersRepository} from "../users/users.repository.interface";
import {IAuthService} from "./auth.service.interface";

@injectable()
export class AuthService{

    constructor(
        @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository
    ) {}

    async login({email, password}: LoginDto): Promise<UserModel | false> {
        const userIsExists = await this.usersRepository.find(email);

        if (!userIsExists) {
            return false;
        }
        const newUser = new User(userIsExists.name, userIsExists.surname, userIsExists.middleName, userIsExists.email, userIsExists.username, userIsExists.password)
        const checkPass = await newUser.comparePassword(password);
        if (!checkPass) {
            return false
        }
        return userIsExists;
    }

}