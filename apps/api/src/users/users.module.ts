import { Module } from '@nestjs/common';
import { SessionModule } from '../common/session/session.module.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [SessionModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
