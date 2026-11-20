import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { TokensService } from './tokens/tokens.service.js';

@Module({
  imports: [EmailModule],
  controllers: [AuthController],
  providers: [AuthService, TokensService],
})
export class AuthModule {}
