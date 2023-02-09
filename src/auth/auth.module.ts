import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { FoldersModule } from "../folders/folders.module";

@Module({
  imports: [
      UsersModule,
      FoldersModule,
      JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'secret',
            signOptions: {
            algorithm: 'HS256',
            expiresIn: '15h'
            },
        })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
