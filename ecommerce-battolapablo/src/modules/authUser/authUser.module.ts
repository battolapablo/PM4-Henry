import { Module } from '@nestjs/common';
import { AuthUsersController } from './authUser.controller';
import { AuthUserService } from './authUser.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthUsersController],
  providers: [AuthUserService],
})
export class AuthUserModule {}
