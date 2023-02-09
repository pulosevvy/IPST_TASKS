import { Module } from "@nestjs/common";
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users.model";
import { Folder } from "../folders/folders.model";

@Module({
    imports: [
        SequelizeModule.forFeature(
              [User, Folder]
        ),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
