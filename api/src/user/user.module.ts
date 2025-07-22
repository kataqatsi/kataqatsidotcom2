import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { DbProvider } from '../db/db.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, DbProvider],
  exports: [UserService, UserRepository],
})
export class UserModule {}
