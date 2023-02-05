import {IUsersRepository} from "./users.repository.interface";
import {User} from "./user.entity";
import {UserModel} from "@prisma/client";
import {inject, injectable} from "inversify";
import {PrismaService} from "../database/prisma.service";
import {TYPES} from "../types";

@injectable()
export class UsersRepository implements IUsersRepository{

    constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

    async create({ name, surname, middleName, email, username, password }: User): Promise<UserModel> {
        return this.prismaService.client.userModel.create({
            data: {
                name,
                surname,
                middleName,
                email,
                username,
                password
            }
        });
    }

    async find(email: string, username?: string): Promise<UserModel | null> {
        // return this.prismaService.client.userModel.findFirst({where: {email: email}});
        return this.prismaService.client.userModel.findFirst({where: {OR: [{email: email}, {username: username}]}});
    }

    async updateConfirm(userId: number): Promise<UserModel | null> {
        return this.prismaService.client.userModel.update({
            where: {
                id: userId
            },
            data: {
                is_confirmed: true
            }
        })
    }
}