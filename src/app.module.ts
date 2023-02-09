import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from "@nestjs/config";
import { FoldersModule } from './folders/folders.module';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users/users.model";
import { Folder } from "./folders/folders.model";


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
          models: [User, Folder],
          autoLoadModels: true
      }),
      UsersModule,
      AuthModule,
      FilesModule,
      FoldersModule,
  ]
})
export class AppModule {}
