import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module.js';
import { SessionGuard } from './session.guard.js';

@Module({
  imports: [AuthModule],
  providers: [SessionGuard],
  exports: [SessionGuard],
})
export class SessionModule {}
