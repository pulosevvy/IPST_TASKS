import { User } from "./user.entity";
import {UserModel} from "@prisma/client";

export interface IUsersRepository {
    create: (user: User) => Promise<UserModel>;
    find: (email: string, username?: string) => Promise<UserModel | null>;
}