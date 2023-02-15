import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";

import { FilesService } from './files.service';
import { Folder } from "../folders/folders.model";
import { File } from "../files/files.model";
import { FilesController } from './files.controller';
import { FoldersModule } from "../folders/folders.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
      SequelizeModule.forFeature(
          [File, Folder]
      ),
      FoldersModule,
      AuthModule
  ],
  providers: [FilesService],
  controllers: [FilesController]
})
export class FilesModule {}
