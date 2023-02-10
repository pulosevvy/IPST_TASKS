import { forwardRef, Module } from "@nestjs/common";
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { SequelizeModule } from "@nestjs/sequelize";
import { Folder } from "./folders.model";
import { User } from "../users/users.model";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        SequelizeModule.forFeature(
          [User, Folder]
        ),
        forwardRef(() => AuthModule)
    ],
    controllers: [FoldersController],
    providers: [FoldersService],
    exports: [FoldersService]
})
export class FoldersModule {}
