import {User} from "../users/user.entity";
import {inject, injectable} from "inversify";
import {UsersRepository} from "../users/users.repository";
import {TYPES} from "../types";
import {sign} from "jsonwebtoken";
import {LoginDto} from "./dto/login.dto";

@injectable()
export class AuthService {

    constructor(
        @inject(TYPES.UsersRepository) private usersRepository: UsersRepository
    ) {}

    async login({email, password}: LoginDto) {
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