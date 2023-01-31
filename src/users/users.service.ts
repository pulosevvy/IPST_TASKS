import {IUserService} from "./users.service.interface";
import {User} from "./user.entity";
import {UserRegisterDto} from "./dto/user-register.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {injectable} from "inversify";
import 'reflect-metadata';

@injectable()
export class UserService implements IUserService {

    async createUser(body: UserRegisterDto): Promise<User | null> {
        const newUser = new User(body.name, body.surname, body.middleName, body.email, body.username);
        await newUser.setPassword(body.password);
        return null;
    }

    async validateUser(dto: UserLoginDto): Promise<boolean> {
        return true;
    }
}