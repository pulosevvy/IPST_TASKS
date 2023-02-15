import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { FoldersModule } from './folders/folders.module';
import { User } from "./users/users.model";
import { Folder } from "./folders/folders.model";
import { File } from "./files/files.model";


@Module({
  imports: [
      ConfigModule.forRoot({}),
      SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USERNAME,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRESS_DATABASE,
          models: [User, Folder, File],
          autoLoadModels: true
      }),
      UsersModule,
      AuthModule,
      FilesModule,
      FoldersModule,
  ]
})
export class AppModule {}
