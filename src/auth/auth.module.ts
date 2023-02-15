import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { FoldersModule } from "../folders/folders.module";

@Module({
  imports: [
      UsersModule,
      forwardRef(() => FoldersModule),
      JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'secret',
            signOptions: {
            algorithm: 'HS256',
            expiresIn: '15h'
            },
        })
  ],
  controllers: [AuthController],
  providers: [AuthService],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
