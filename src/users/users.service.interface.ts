import {UserCreateDto} from "./dto/user-create.dto";
import {UserModel} from "@prisma/client";

export interface IUserService {
    createUser: (dto: UserCreateDto) => Promise<UserModel | null>;
    getUserInfo: (email: string) => Promise<UserModel | null>;
    activate: (email: string) => Promise<UserModel | null>;
};