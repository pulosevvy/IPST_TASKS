import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { Folder } from "./folders.model";
import { User } from "../users/users.model";
import { AuthModule } from "../auth/auth.module";
import { File } from "../files/files.model";

@Module({
    imports: [
        SequelizeModule.forFeature(
          [User, Folder, File]
        ),
        forwardRef(() => AuthModule)
    ],
    controllers: [FoldersController],
    providers: [FoldersService],
    exports: [FoldersService]
})
export class FoldersModule {}
