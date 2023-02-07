import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FolderModule } from './folder/folder.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [UsersModule, AuthModule, FolderModule, FilesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
