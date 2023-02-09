import { Module } from "@nestjs/common";
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { SequelizeModule } from "@nestjs/sequelize";
import { Folder } from "./folders.model";
import { User } from "../users/users.model";

@Module({
    imports: [
        SequelizeModule.forFeature(
          [User, Folder]
        ),
    ],
    controllers: [FoldersController],
    providers: [FoldersService],
    exports: [FoldersService]
})
export class FoldersModule {}
